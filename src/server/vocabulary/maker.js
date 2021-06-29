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
  let data = req.body.data
    .filter((d) => d.icelandic)
    .sort((a, b) =>
      getRawTextFromVocabularyEntry(a.icelandic).localeCompare(
        getRawTextFromVocabularyEntry(b.icelandic),
        "is",
        { ignorePunctuation: true }
      )
    );
  data = data.map((j) => removeEmpty(j));
  fs.writeFile(
    filename,
    yaml.dump(data, { lineWidth: -1, quotingType: '"' }),
    (err) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.sendStatus(200);
      }
    }
  );
});

export default router;

// https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v));
  // return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null));
}
