import { exec } from "child_process";
import { Response, Router } from "express";
import fs from "fs";
import path from "path";
import shortid from "shortid";
import { upload_path } from "ylhyra/server";
import {
  AeneasAudioSyncOutput,
  XmlForAeneas,
} from "ylhyra/content/translationEditor/audioSynchronization/types";

const router = Router();

/*
  TODO: This should be put as a queued process
*/
router.post("/api/audio/synchronize", (req, res) => {
  const { filename, xml } = req.body;
  if (!filename || !xml) {
    res.status(400);
    res.send(`Missing parameters`);
  } else {
    /** TODO: Get file from ylhyra_content */
    throw new Error("Not implemented");
    synchronize({ audioFilepath: filepath, xml }, res);
  }
});

/**
 * Here we use [Aeneas](https://github.com/readbeyond/aeneas)
 * to automatically synchronize audio and text.
 */
const synchronize = async (
  {
    lang,
    audioFilepath,
    xml,
  }: {
    /** Three letter  ISO 639-3 language code */
    lang?: string;
    audioFilepath: string;
    xml: XmlForAeneas;
  },
  res: Response<AeneasAudioSyncOutput | unknown>
) => {
  const tmpName = `tmp_${shortid.generate()}`;
  const LANGUAGE_CODE = lang || "isl";
  const AUDIO_FILE_PATH = audioFilepath;
  const INPUT_XML = path.resolve(upload_path, `${tmpName}.xhtml`);
  const OUTPUT_JSON = path.resolve(upload_path, `${tmpName}.json`);

  await new Promise<void>((resolve) => {
    fs.writeFile(INPUT_XML, `<xml id="root">${xml}</xml>`, (err) => {
      if (err) throw err;
      resolve();
    });
  });

  try {
    await new Promise<void>((resolve, reject) => {
      let command = "";
      /* SENTENCE LEVEL */
      if (true) {
        command =
          ` python -m aeneas.tools.execute_task ` +
          `  ${AUDIO_FILE_PATH} ` +
          `  ${INPUT_XML} ` +
          `  "task_language=${LANGUAGE_CODE}|` +
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
          `  "task_language=${LANGUAGE_CODE}|` +
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
  } catch (e: unknown) {
    res.status(500);
    return res.send(e);
  }

  const json: AeneasAudioSyncOutput = await new Promise((resolve) => {
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
