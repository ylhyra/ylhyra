import { Router } from "express";
import fs from "fs";
// @ts-ignore
import yaml from "js-yaml";
import _ from "underscore";
import { removeExtraWhitespace } from "modules/removeExtraWhitespace";
import { vocabularyRowTitles } from "ylhyra/vocabulary/vocabularyEditor/rowTitles";
import { contentFolder } from "ylhyra/server/paths_directories";

const router = Router();
const filename = contentFolder + `/not_data/vocabulary/vocabulary`;

router.post("/api/vocabulary_maker/get", (req, res) => {
  fs.readFile(
    filename + (req.body.deckName || "") + ".yml",
    "utf8",
    (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(yaml.load(data));
      }
    }
  );
});

router.post("/api/vocabulary_maker", (req, res) => {
  if (process.env.NODE_ENV !== "development") return res.sendStatus(500);
  let data = req.body.data;
  data = {
    rows: data.rows
      .filter((d) => d.icelandic)
      .sort((a, b) => a.row_id - b.row_id)
      .map((row) => {
        let out = {};
        // delete row.row_id;
        _.uniq([...vocabularyRowTitles, "row_id", ...Object.keys(row)]).forEach(
          (key) => {
            if (!row[key]) return;
            if (typeof row[key] === "string") {
              if (!row[key].trim()) return;
              out[key] = removeExtraWhitespace(row[key])
                .replace(/^[,;]+ ?/g, "")
                .replace(/[,;]+$/g, "")
                .replace(/ [–—] /g, " - ");
            } else {
              out[key] = row[key];
            }
          }
        );
        return out;
      }),
    sound: data.sound.map((j) => {
      delete j.lowercase;
      return j;
    }),
  };

  const y = yaml.dump(data, { lineWidth: -1, quotingType: '"' });
  fs.writeFile(filename + (req.body.deckName || "") + ".yml", y, (err) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.sendStatus(200);
    }
  });
  // /* Backup */
  // fs.writeFile(
  //   content_folder +
  //     `/not_data/vocabulary/BACKUP/vocabulary${
  //       req.body.deckName || ""
  //     }.${new Date().getTime()}.yml`,
  //   y,
  //   () => {}
  // );
});

export default router;
