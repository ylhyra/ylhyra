import express, { Request, Response } from "express";
import withLicense from "inflection/server/views/license";
import {
  FuzzySearchOutputObject,
  FuzzySearchReturns,
  MainSearchParameters,
  WebsiteSearch,
} from "inflection/server/types";
import layout from "inflection/server/views/layout";
import { renderEntry } from "inflection/tables/renderEntry";
import { tree } from "inflection/tables/tree";
import { cacheControl } from "ylhyra/server/caching";
import Get_by_id from "inflection/server/search/getById";
import Search from "inflection/server/search/search";

const router = express.Router();

/**
 * Website
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
    req: Request<{ id?: number; word: string }, {}, {}, WebsiteSearch>,
    res: Response
  ) => {
    cacheControl(res, "cached_html");
    const id = req.query.id || req.params.id;
    const word = req.query.q || req.params.word;
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
              // @ts-ignore
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
                results: renderEntry(rows, req.query),
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
              if (!results /*|| results === "Error"*/) {
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

              const { perfect_matches, did_you_mean } =
                results as FuzzySearchReturns;

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
                    results: renderEntry(rows, req.query),
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
      res.status(400).send(
        // @ts-ignore
        `There was an error. <br><small>The message was ${e.message}</small>`
      );
    }
  }
);

export default router;

const renderItemOnSearchPage = (i: FuzzySearchOutputObject) => `
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
