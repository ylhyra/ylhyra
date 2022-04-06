/*
  node -r esm scripts/pre-processing/Blær/Upload_images.js
*/
import path from "path";
import forEachAsync from "src/modules/forEachAsync";
import fs from "fs";

const http = require("https");

const uploadPath = path.resolve(
  process.env.PWD,
  "./../ylhyra_content/not_data/files/images/blær"
);

const markdown_file = path.resolve(
  process.env.PWD,
  "./../ylhyra_content/not_data/content/reading/text/Blær/Egg_í_áskrift/Egg_í_áskrift.md"
);
let data = fs.readFileSync(markdown_file, "utf8");

const FILES_TO_DOWNLOAD = [];
data.replace(/"(https?:[^"]+?\.[a-z0-9]+)"/gi, (x, url) => {
  FILES_TO_DOWNLOAD.push(url);
});
// console.log(FILES_TO_DOWNLOAD);
// process.exit();
(async function () {
  await forEachAsync(FILES_TO_DOWNLOAD, async (file_url) => {
    return new Promise((resolve) => {
      const filename = "Blaer_egg_i_askrift_" + file_url.replace(/^.+\//, "");
      const file = fs.createWriteStream(path.resolve(uploadPath, filename));
      http.get(file_url, function (response) {
        response.pipe(file);
        fs.writeFileSync(
          path.resolve(uploadPath, filename + ".md"),
          `
          ---
          title: File:${filename}
          ---
          
          {{c}} Blær
          `
            .trim()
            .replace(/^ +/gm, "")
        );
        console.log(filename);
        data = data.replaceAll(file_url, "/api/content?title=File:" + filename);
        setTimeout(resolve, 1000);
      });
    });
  });
  data = data.replace(
    /<img src="\/api\/content\?title=File:(.+)">/g,
    '<Image src="$1"/>'
  );
  fs.writeFileSync(markdown_file, data);
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
