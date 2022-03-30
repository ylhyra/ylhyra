import express from "express";
import fs from "fs";
import path from "path";
import { ylhyra_content_files } from "server/paths_backend";

const router = express.Router();

router.post("/recorder/save", (req, res) => {
  if (process.env.NODE_ENV !== "development") return;
  const { base64_data, word, speaker, speed } = req.body;
  var buffer = Buffer.from(base64_data, "base64");

  const output_folder = path.resolve(
    ylhyra_content_files,
    `./audio/pronunciation/`
  );
  let filename =
    speaker +
    (["slow", "normal", "fast"].indexOf(speed) + 1) +
    "_" +
    word
      .trim()
      .replace(/ +/g, "_")
      .replace(/[.,!?:;/~()[\]{}]/g, "");
  let filepath = output_folder + `/${filename}`;

  /* Check if filename is in use */
  fs.stat(filepath + ".mp3.md", function (err) {
    if (err === null) {
      /* Filename already exists */
      filename += "_" + Math.ceil(Math.random() * 999);
      filepath = output_folder + `/${filename}`;
    }

    const desc = `
      ---
      title: File:${filename}.mp3
      recording of: ${word}
      reading speed: ${speed}
      speaker: ${speaker}
      license: CC0
      ---
    `
      .replace(/^ +/gm, "")
      .trim();

    fs.writeFileSync(filepath + ".mp3.md", desc, () => {});
    fs.writeFile(filepath + ".wav", buffer, (err) => {
      if (err) {
        console.error(err);
        return res.status(500);
      }
      // console.log("The file was saved!")
      // // console.log(`
      // //   ffmpeg -i ${wavPath}
      // //     # -vn -af
      // //     # acompressor=threshold=-21dB:ratio=9:attack=200:release=1000
      // //     # silenceremove=1:0:0:1:1:-50dB:1
      // //     ${mp3}
      // //   # &&
      // //   # rm ${mp3Path}
      // // `)
      res.send(filename + ".mp3");
      // exec(
      //   `
      //   ffmpeg -i ${filepath}.wav ${filepath}.mp3
      //   ffmpeg -i ${filepath}.wav -c:a libopus -b:a 32K ${filepath}.opus
      // `,
      //   (err) => {
      //     if (err) {
      //       console.error(err);
      //       // return res.sendStatus(500);
      //     }
      //     // return res.send(filename + ".mp3");
      //   }
      // );
    });
  });
});
export default router;

/*
  TODO
  https://ffmpeg.org/ffmpeg-filters.html#silenceremove
  nota "silenceremove=1:1:-50dB:1:1:-50dB:1" á ffmpeg
*/
