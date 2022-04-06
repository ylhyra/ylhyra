import { exec } from "child_process";
import { Router } from "express";
import fs from "fs";
import { isDev } from "modules/isDev";
import path from "path";
import { getValuesForUrl } from "ylhyra/content/documents/links/getValuesForUrl.server";
import { getBaseDir } from "ylhyra/server/paths.server";

const router = Router();

/**
 * Saves the translation data into `../ylhyra_content/data`
 */
router.post("/api/translator/saveTranslationData", (req, res) => {
  if (!isDev) return;
  const { title, text } = req.body;
  let urlInfo = getValuesForUrl("Data:" + title);
  let filepath = "filepath" in urlInfo && urlInfo.filepath;
  if (!filepath) {
    filepath = path.resolve(
      getBaseDir(),
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
