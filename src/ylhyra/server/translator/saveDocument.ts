import { isDev } from "modules/isDev";
import { exec } from "child_process";
import { Router } from "express";
import fs from "fs";
import path from "path";
import { getValuesForURL } from "ylhyra/server/content/links";

const router = Router();

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
