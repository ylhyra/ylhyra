import { exec } from "child_process";
import fs from "fs";
import path from "path";

import { upload_path } from "server";
import shortid from "shortid";
import fileExtension from "file-extension";

const router = require("express").Router();
/*
  TODO: This should be put as a queued process
*/
router.post("/audio/synchronize", (req, res) => {
  const { filename, xml } = req.body;
  if (!filename || !xml) {
    res.status(400);
    // console.log({lang,audio_file,xml})
    res.send(`Missing parameters`);
  } else {
    // TEMP
    DownloadFile(filename, res, (filepath) => {
      synchronize({ filepath, xml }, res);
    });
    // res.sendStatus(200)
  }
});

const DownloadFile = (filename, res, callback) => {
  const tmp_filepath = path.resolve(
    upload_path,
    `tmp_${shortid.generate()}.${fileExtension(filename)}`
  );
  exec(` curl -sS -L "" --output ${tmp_filepath} `, (err, stdout, stderr) => {
    if (err || stderr) {
      console.error(err || stderr);

      res.status(500);
      res.send({ error: err || stderr });
    } else {
      callback(tmp_filepath);
    }
  });
};

/**
  Here we use [Aeneas](https://github.com/readbeyond/aeneas)
  to automatically synchronize audio and text.
*/
const synchronize = async ({ lang, filepath, xml }, res) => {
  const tmp_name = `tmp_${shortid.generate()}`;
  const LANGUAGE = lang || "isl"; // Three letter ISO 639-3 language code
  const AUDIO_FILE_PATH = filepath;
  const INPUT_XML = path.resolve(upload_path, `${tmp_name}.xhtml`);
  const OUTPUT_JSON = path.resolve(upload_path, `${tmp_name}.json`);

  // console.log(xml)
  // console.log(INPUT_XML)
  await new Promise((resolve) => {
    fs.writeFile(INPUT_XML, `<xml id="root">${xml}</xml>`, (err) => {
      if (err) throw err;
      resolve();
    });
  });

  try {
    await new Promise((resolve, reject) => {
      let command = "";
      /* SENTENCE LEVEL */
      if (true) {
        command =
          ` python -m aeneas.tools.execute_task ` +
          `  ${AUDIO_FILE_PATH} ` +
          `  ${INPUT_XML} ` +
          `  "task_language=${LANGUAGE}|` +
          `os_task_file_format=json|` +
          `is_text_type=unparsed|` +
          `is_text_unparsed_id_sort=unsorted|` +
          `is_text_unparsed_id_regex=s[A-Za-z0-9_\\-]+"` +
          ` ${OUTPUT_JSON} `;
      } else {
        /* WORD LEVEL */
        command =
          ` python -m aeneas.tools.execute_task ` +
          `  ${AUDIO_FILE_PATH} ` +
          `  ${INPUT_XML} ` +
          `  "task_language=${LANGUAGE}|` +
          `os_task_file_format=json|` +
          `is_text_type=munparsed|` +
          `is_text_munparsed_l1_id_regex=root|` +
          `is_text_munparsed_l2_id_regex=s[A-Za-z0-9_\\-]+|` +
          `is_text_munparsed_l3_id_regex=w[A-Za-z0-9_\\-]+"` +
          ` ${OUTPUT_JSON} ` +
          ` --presets-word`;
      }
      exec(command, (err, stdout, stderr) => {
        if (stderr) {
          console.error(stderr);
          reject(stderr);
        } else if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (e) {
    res.status(500);
    return res.send(e);
  }

  const json = await new Promise((resolve) => {
    fs.readFile(OUTPUT_JSON, "utf8", (err, data) => {
      if (err) throw err;
      // console.log(data)
      resolve(data);
    });
  });

  res.send(json);

  fs.unlink(OUTPUT_JSON, () => {});
  fs.unlink(INPUT_XML, () => {});
  fs.unlink(AUDIO_FILE_PATH, () => {});
};

export default router;
