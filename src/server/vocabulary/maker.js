import express from "express";
import query from "server/database";
import shortid from "shortid";
import sql from "server/database/functions/SQL-template-literal";
import cors from "cors";
import { content_folder } from "paths_backend";
const router = require("express").Router();
const fs = require("fs");
const filename = content_folder + "/not_data/vocabulary/vocabulary.json";
router.get("/vocabulary_maker", (req, res) => {
  res.sendFile(filename);
});
router.post("/vocabulary_maker", (req, res) => {
  if (process.env.NODE_ENV !== "development") return res.sendStatus(500);
  let data = req.body.data
    .filter((d) => d.icelandic)
    .sort((a, b) =>
      a.icelandic.localeCompare(b.icelandic, "is", { ignorePunctuation: true })
    );
  data = data.map((j) => removeEmpty(j));
  fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

export default router;

// https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null));
}
