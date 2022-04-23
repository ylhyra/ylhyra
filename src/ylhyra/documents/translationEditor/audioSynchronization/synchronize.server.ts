import { exec } from "child_process";
import { Response, Router } from "express";
import { promises as fs } from "fs";
import path from "path";
import shortid from "shortid";

import {
  AeneasAudioSyncOutput,
  XmlForAeneas,
} from "ylhyra/documents/translationEditor/audioSynchronization/types";
import { uploadPath } from "ylhyra/server/paths_directories";

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
    throw new Error("Not implemented");
    /** TODO: Get filepath from ylhyra_content */
    // synchronize({ audioFilepath: filepath, xml }, res);
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
  const INPUT_XML_PATH = path.resolve(uploadPath, `${tmpName}.xhtml`);
  const OUTPUT_JSON_PATH = path.resolve(uploadPath, `${tmpName}.json`);

  await fs.writeFile(INPUT_XML_PATH, `<xml id="root">${xml}</xml>`);

  try {
    await new Promise<void>((resolve, reject) => {
      let command = "";
      /* SENTENCE LEVEL */
      if (true) {
        command =
          ` python -m aeneas.tools.execute_task ` +
          `  ${AUDIO_FILE_PATH} ` +
          `  ${INPUT_XML_PATH} ` +
          `  "task_language=${LANGUAGE_CODE}|` +
          `os_task_file_format=json|` +
          `is_text_type=unparsed|` +
          `is_text_unparsed_id_sort=unsorted|` +
          `is_text_unparsed_id_regex=s[A-Za-z0-9_\\-]+"` +
          ` ${OUTPUT_JSON_PATH} `;
      } else {
        // /* WORD LEVEL */
        // command =
        //   ` python -m aeneas.tools.execute_task ` +
        //   `  ${AUDIO_FILE_PATH} ` +
        //   `  ${INPUT_XML_PATH} ` +
        //   `  "task_language=${LANGUAGE_CODE}|` +
        //   `os_task_file_format=json|` +
        //   `is_text_type=munparsed|` +
        //   `is_text_munparsed_l1_id_regex=root|` +
        //   `is_text_munparsed_l2_id_regex=s[A-Za-z0-9_\\-]+|` +
        //   `is_text_munparsed_l3_id_regex=w[A-Za-z0-9_\\-]+"` +
        //   ` ${OUTPUT_JSON_PATH} ` +
        //   ` --presets-word`;
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

  const json: AeneasAudioSyncOutput = JSON.parse(
    await fs.readFile(OUTPUT_JSON_PATH, "utf8")
  );

  res.send(json);

  await fs.unlink(OUTPUT_JSON_PATH);
  await fs.unlink(INPUT_XML_PATH);
  await fs.unlink(AUDIO_FILE_PATH);
};

export default router;
