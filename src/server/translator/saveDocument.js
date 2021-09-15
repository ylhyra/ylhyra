import query from "server/database";
import string_hash from "app/app/functions/hash";
import simplifyString from "server/translator/helpers/simplifyString";
import GetTranslationFrame from "server/translator/helpers/TranslationFrame";
import SQL_helper from "server/translator/helpers/SQL_helper";
import fs from "fs";
import { getValuesForURL } from "server/content/links";
import path from "path";
import { FileSafeTitle, URL_title } from "app/app/paths";
import { isDev } from "app/app/functions/isDev";

const router = require("express").Router();

router.post("/translator/saveDocument", (req, res) => {
  if (!isDev) return;
  const { title, text } = req.body;
  let { filepath } = getValuesForURL("Data:" + title);

  if (!filepath) {
    filepath = path.resolve(
      process.env.PWD,
      "./../ylhyra_content/data/${FileSafeTitle(title).md"
    );
  }
  fs.writeFile(filepath, `---\ntitle: Data:${title}\n---\n\n` + text, (err) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

export default router;
