import express from "express";
import query from "server/database";
import shortid from "shortid";
import sql from "server/database/functions/SQL-template-literal";
import cors from "cors";
import { content_folder } from "paths_backend";
import { getRawTextFromVocabularyEntry } from "app/VocabularyMaker/functions.js";
const router = require("express").Router();
const fs = require("fs");
const filename = content_folder + "/not_data/vocabulary/vocabulary.yml";
const yaml = require("js-yaml");
router.get("/vocabulary_maker", (req, res) => {
  fs.readFile(filename, "utf8", (err, data) => {
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
      .sort(
        (a, b) =>
          getRawTextFromVocabularyEntry(a.icelandic).localeCompare(
            getRawTextFromVocabularyEntry(b.icelandic),
            "is",
            {
              ignorePunctuation: true,
            }
          ) || a.row_id - b.row_id
      )
      .map((row) => {
        let out = {};
        Object.keys(row).forEach((k) => {
          if (!row[k]) return;
          if (typeof row[k] === "string") {
            if (!row[k].trim()) return;
            out[k] = row[k]
              .trim()
              .replace(/\s+/g, " ")
              .replace(/^, ?/g, "")
              .replace(/,$/g, "");
          } else {
            out[k] = row[k];
          }
        });
        return out;
      }),
    sound: data.sound,
  };

  const y = yaml.dump(data, { lineWidth: -1, quotingType: '"' });
  fs.writeFile(filename, y, (err) => {
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
