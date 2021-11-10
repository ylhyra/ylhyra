import { content_folder } from "server/paths_backend";
import _ from "underscore";
import { row_titles } from "maker/vocabulary_maker/compile/rowTitles";

const router = require("express").Router();
const fs = require("fs");
const filename = content_folder + `/not_data/vocabulary/vocabulary`;
const yaml = require("js-yaml");

router.post("/vocabulary_maker/get", (req, res) => {
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
router.post("/vocabulary_maker", (req, res) => {
  if (process.env.NODE_ENV !== "development") return res.sendStatus(500);
  let data = req.body.data;
  data = {
    rows: data.rows
      .filter((d) => d.icelandic)
      .sort((a, b) => a.row_id - b.row_id)
      // .sort(
      //   (a, b) =>
      //     getRawTextFromVocabularyEntry(a.icelandic).localeCompare(
      //       getRawTextFromVocabularyEntry(b.icelandic),
      //       "is",
      //       {
      //         ignorePunctuation: true,
      //       }
      //     ) || a.row_id - b.row_id
      // )
      .map((row) => {
        let out = {};
        // delete row.row_id;
        _.uniq([
          "icelandic",
          "english",
          ...row_titles,
          "row_id",
          ...Object.keys(row),
        ]).forEach((key) => {
          if (!row[key]) return;
          if (typeof row[key] === "string") {
            if (!row[key].trim()) return;
            out[key] = row[key]
              .trim()
              .replace(/\s+/g, " ")
              .replace(/^[,;]+ ?/g, "")
              .replace(/[,;]+$/g, "")
              .replace(/ [–—] /g, " - ");
          } else {
            out[key] = row[key];
          }
        });
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
  /* Backup */
  fs.writeFile(
    content_folder +
      `/not_data/vocabulary/BACKUP/vocabulary${
        req.body.deckName || ""
      }.${new Date().getTime()}.yml`,
    y,
    () => {}
  );
});

export default router;
