import getSortKeys from "./sortKeys";
const fs = require("fs");
const path = require("path");

/*
  Finds sentences from dataset that only use easy terms
*/
const run = () => {
  fs.readFile(
    path.resolve(__basedir + "./../Desktop/Ylhýruskjöl/LÍNUR.txt"),
    "utf8",
    async (err, data) => {
      let known_words = {};
      Object.keys(await getSortKeys()).forEach((sentence) => {
        sentence.toLowerCase().replace(/([a-záéíóúýðþæö]+)/, (word) => {
          known_words[word] = true;
        });
      });
      let matches = [];
      data.split("\n").forEach((line) => {
        let is_match = true;
        line.toLowerCase().replace(/([a-záéíóúýðþæö]+)/, (word) => {
          if (!(word in known_words)) {
            is_match = false;
          }
        });
        if (is_match) {
          matches.push(line);
        }
      });
      fs.writeFileSync(
        __basedir + "./../Desktop/Ylhýruskjöl/LÍNUR_matches.txt",
        matches.join("\n"),
        (err) => {}
      );
    }
  );
};
run();
