/*

  This file contains the routes for both the inflection site and the API.
  It both supports sending requests to the database or the database-less backends.
  For that reason, the "Search" and "Get_by_id" functions are passed as parameters.

*/
import express, { Request, Response } from "express";
import _Get_by_id from "inflection/getViaApi/getById";
import _Search from "inflection/getViaApi/search";
import withLicense from "inflection/server/server-with-database/license";
import { MainSearch, WebsiteSearch } from "inflection/server/types";
import layout from "inflection/server/views/layout";
import render from "inflection/tables/renderEntry";
import { tree } from "inflection/tables/tree";
import { cacheControl } from "ylhyra/server/caching";

const router = express.Router();

export default (Search: typeof _Search, Get_by_id: typeof _Get_by_id) => {
  /*
    API
  */
  router.get(
    "/api/inflections?",
    (req: Request<{}, {}, {}, MainSearch>, res: Response) => {
      cacheControl(res, "cached_html");
      res.setHeader("X-Robots-Tag", "noindex");
      let { id, type, search, fuzzy, return_rows_if_only_one_match } =
        req.query;
      if (search) {
        return Search(
          { word: search, fuzzy, return_rows_if_only_one_match },
          (results) => {
            res.json({ results });
          }
        );
      } else if (id) {
        Get_by_id(id, (rows) => {
          if (!rows) {
            return res.status(400).send({
              error: `There was an error.`,
            });
          }
          try {
            /* Flat */
            if (type === "flat") {
              return res.json(withLicense(rows));
            } else if (type === "html") {
              /* HTML */
              return res.send(render(rows, req.query));
            } else {
              /* Nested */
              return res.send(withLicense(tree(rows)));
            }
          } catch (e) {
            if (type === "html") {
              res
                .status(400)
                .send(
                  `There was an error. <br><small>The message was ${
                    (e as Error).message
                  }</small>`
                );
            } else {
              res.status(400).send({
                error: `There was an error. The message was ${
                  (e as Error).message
                }`,
              });
            }
          }
        });
      } else {
        return res.status(400).send({ error: "Parameters needed" });
        // return res.sendFile(path.resolve(__dirname, `./../docs/README.md`))
      }
    }
  );

  /*
    Website
  */
  router.get(
    ["/robots.txt", "/favicon.ico", "/sitemap.xml"],
    (req: Request, res: Response) => {
      cacheControl(res, "immutable");

      res.send("");
    }
  );
  router.get(
    ["/", "/:id(\\d+)/", "/:word?/:id(\\d+)?"],
    (
      req: Request<{ id?: number; q: string }, {}, {}, WebsiteSearch>,
      res: Response
    ) => {
      cacheControl(res, "cached_html");
      const id = req.query.id || req.params.id;
      const word = (req.query.q || req.params.word).toString();
      const embed = "embed" in req.query;

      const sendError = (e: unknown) => {
        console.error(e);
        return res.send(
          layout({
            title: word,
            string: word,
            results:
              'There was an error. Please <a href="mailto:ylhyra@ylhyra.is">click here</a> to report this error.' +
              `<br><br><small class=gray>Error message: ${
                e && e?.message
              }</small>`,
          })
        );
      };

      try {
        if (id) {
          Get_by_id(id, (rows) => {
            if (!rows || rows.length === 0) {
              return res.send(
                layout({
                  title: word,
                  string: word,
                  results:
                    rows === null
                      ? "Internal network error. Try reloading."
                      : "No matches",
                })
              );
            }
            try {
              // console.log(rows)
              res.send(
                layout({
                  title: rows[0].base_word || "",
                  string: word,
                  results: render(rows, req.query),
                  id,
                  embed,
                })
              );
            } catch (e) {
              sendError(e);
            }
          });
        } else if (word) {
          Search(
            {
              word: word,
              fuzzy: true,
              return_rows_if_only_one_match: true,
            },
            (results) => {
              try {
                /*
                No results
              */
                if (!results || results === "Error") {
                  return res.send(
                    layout({
                      title: word,
                      string: word,
                      embed,
                      results:
                        results === "Error"
                          ? "Error, try reloading"
                          : "No matches",
                    })
                  );
                }

                // console.log(results)

                const { perfect_matches, did_you_mean } = results;

                let output = "";
                let did_you_mean_string = "";
                if (perfect_matches.length > 0) {
                  output += `<ul class="results">
                  ${perfect_matches.map(renderItemOnSearchPage).join("")}
                </ul>`;
                }
                if (did_you_mean.length > 0) {
                  did_you_mean_string += `
                <h4 class="did-you-mean">
                  ${
                    perfect_matches.length > 0
                      ? perfect_matches.length === 1
                        ? "You may also be looking for:"
                        : "Or did you mean:"
                      : "Did you mean:"
                  }</h4>
                <ul class="results">
                  ${did_you_mean.map(renderItemOnSearchPage).join("")}
                </ul>`;
                }

                /*
                One result
              */
                if (perfect_matches.length === 1) {
                  const { rows } = perfect_matches[0];
                  res.send(
                    layout({
                      title: rows[0].base_word || "",
                      string: word,
                      results: render(rows, req.query),
                      did_you_mean_in_footer: did_you_mean_string,
                      id: rows[0].BIN_id,
                      embed,
                    })
                  );
                } else {
                  /*
                Many results
              */
                  res.send(
                    layout({
                      title: word,
                      string: word,
                      results: output + did_you_mean_string,
                      embed,
                    })
                  );
                }
              } catch (e) {
                sendError(e);
              }
            }
          );
        } else {
          res.send(layout({}));
        }
      } catch (e) {
        res
          .status(400)
          .send(
            `There was an error. <br><small>The message was ${e.message}</small>`
          );
      }
    }
  );

  return router;
};

const renderItemOnSearchPage = (i) => `
  <li>
    <a href="/${
      i.matched_term ? encodeURIComponent(i.matched_term) + "/" : ""
    }${i.BIN_id}">
      ${
        i.snippet
          ? `<div class="snippet">${i.snippet}</div>`
          : `<div><strong>${i.base_word}</strong></div>`
      }
      <div class="description">${i.description}</div>
    </a>
  </li>`;
