/*
node server/datasets/pronunciation/data/InsertToDatabase.js
*/
import LineByLineReader from "line-by-line";
import path from "path";
import query from "ylhyra/server/database";

query(`TRUNCATE TABLE pronunciation`, () => {
  var lr = new LineByLineReader(
    path.resolve(__dirname, "./Icelandic_Pronunciation.csv")
  );
  lr.on("error", (err) => {
    console.error(err);
  });
  var count = 0;

  lr.on("line", (line) => {
    lr.pause();
    if (/\\/.test(line)) {
      // Rusl-línur
      lr.resume();
    } else {
      var split = line.split(",");
      var word = split[0].toLowerCase();
      var pronunciation = split[1];

      query(
        `INSERT INTO pronunciation (word,pronunciation) VALUES ('${word}', "${pronunciation}")`,
        (error) => {
          if (error) throw error;
          if (count % 1000 === 0) {
            console.log(word);
          }
          count++;
          lr.resume();
        }
      );
    }
  });

  lr.on("end", () => {
    process.exit();
  });
});
