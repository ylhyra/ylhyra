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
import { exec } from "child_process";

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

    exec(
      `cd ${
        process.env.PWD
      }/../ylhyra_content/ && git add ${filepath} && git commit -m 'Saving data for ${title.replaceAll(
        "'",
        ""
      )}'`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        // console.log(`stdout: ${stdout}`);
        // console.error(`stderr: ${stderr}`);
      }
    );
  });
});

export default router;
