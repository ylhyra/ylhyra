import express from "express";
import query from "server/database";
import shortid from "shortid";
import sql from "server/database/functions/SQL-template-literal";
import cors from "cors";
import { content_folder } from "paths_backend";
import {
  getRawTextFromVocabularyEntry,
  row_titles,
} from "app/VocabularyMaker/functions";
import _ from "underscore";
const router = require("express").Router();
const fs = require("fs");
// const DECK = "_da";
const DECK = "";
const filename = content_folder + `/not_data/vocabulary/vocabulary${DECK}`;
const yaml = require("js-yaml");

router.get("/vocabulary_maker", (req, res) => {
  fs.readFile(filename + ".yml", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(yaml.load(data));
    }
  });
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
              .replace(/^, ?/g, "")
              .replace(/,$/g, "")
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
  fs.writeFile(filename + ".yml", y, (err) => {
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
      `/not_data/vocabulary/BACKUP/vocabulary.${new Date().getTime()}.yml`,
    y,
    (err) => {}
  );
});

export default router;
