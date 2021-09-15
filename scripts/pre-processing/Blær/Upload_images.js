/*
  node -r esm scripts/pre-processing/Blær/Upload_images.js
*/
import path from "path";
import forEachAsync from "./../../../src/app/app/functions/array-foreach-async";
const http = require("https");
const fs = require("fs");

const FILES_TO_DOWNLOAD = `
`
  .split(/\n/g)
  .filter(Boolean);

const upload_path = path.resolve(
  process.env.PWD,
  "./../ylhyra_content/not_data/files/images/blær"
);

(async function () {
  await forEachAsync(FILES_TO_DOWNLOAD, async (file_url) => {
    return new Promise((resolve) => {
      const filename =
        "Blaer_fyrst_vid_erum_herna_" + file_url.replace(/^.+\//, "");
      const file = fs.createWriteStream(path.resolve(upload_path, filename));
      http.get(file_url, function (response) {
        response.pipe(file);
        fs.writeFileSync(
          path.resolve(upload_path, filename + ".md"),
          `
          ---
          title: File:${filename}
          ---
          
          {{c}} [https://blaer.is/grein/fyrst-vid-erum-herna Blær]
          `
            .trim()
            .replace(/^ +/gm, "")
        );
        console.log(filename);
        resolve();
      });
    });
  });
  console.log("Done");
  process.exit();
})();

// (function () {
//   let articleURL = "https://blaer.is/grein/fyrst-vid-erum-herna";
//   let title = "Blær – Fyrst við erum hérna";
//   var value = txt.value;
//   let split = value.split(/(https?:\/\/blaer.is\/[^" ]+)/g);
//
//   let targetLength = split.map((x, i) => i % 2 !== 0).filter(Boolean).length;
//   let currentLength = 0;
//   let oldToNewTitles = {};
//
//   function checkIfDone() {
//     if (currentLength === targetLength) {
//       const output = split
//         .map((fileURL, index) => {
//           if (index % 2 === 0) return fileURL;
//           return oldToNewTitles[fileURL] || fileURL;
//         })
//         .join("");
//       // console.log(output)
//       txt.value = output;
//     }
//   }
//
//   split.forEach((fileURL, index) => {
//     if (index % 2 === 0) return fileURL;
//     // console.log(fileURL)
//     // return 'haha'
//
//     var api = new mw.Api();
//     api
//       .postWithToken("csrf", {
//         filename: title + " " + Math.round(Math.random() * 100000),
//         text: `{{c}} Blær – ${articleURL}`,
//         url: fileURL,
//         action: "upload",
//         ignorewarnings: "1",
//         format: "json",
//       })
//       .done(function (data) {
//         const newFileURL = `https://ylhyra.is/Special:Filepath/${data.upload.filename}`;
//         oldToNewTitles[fileURL] = newFileURL;
//         currentLength++;
//         console.log(
//           `Uploaded ${newFileURL}. Done ${currentLength} of ${targetLength}`
//         );
//         checkIfDone();
//       });
//   });
// })();
