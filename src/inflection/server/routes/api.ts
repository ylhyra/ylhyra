import express, { Request, Response } from "express";
import Get_by_id from "inflection/server/search/getById";
import Search from "inflection/server/search/search";
import { MainSearchParameters } from "inflection/server/types";
import withLicense from "inflection/server/views/license";
import { renderEntry } from "inflection/tables/renderEntry";
import { tree } from "inflection/tables/tree";
import { cacheControl } from "ylhyra/server/caching";

const router = express.Router();

/*
  API
*/
router.get(
  "/api/inflection",
  (req: Request<{}, {}, {}, MainSearchParameters>, res: Response) => {
    cacheControl(res, "cached_html");
    res.setHeader("X-Robots-Tag", "noindex");
    let { id, type, search, fuzzy, return_rows_if_only_one_match } = req.query;
    if (search) {
      return Search(
        { word: search, fuzzy, return_rows_if_only_one_match },
        (results) => {
          res.json({ results });
        },
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
            return res.send(renderEntry(rows, req.query));
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
                }</small>`,
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
  },
);

// eslint-disable-next-line import/no-default-export
export default router;
