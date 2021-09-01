import getSortKeys from "server/vocabulary/sortKeys";
import { getHash } from "maker/vocabulary_maker/functions";
import { getPlaintextFromFormatted } from "maker/vocabulary_maker/functions";
const fs = require("fs");
const path = require("path");
/*
  Finds sentences from dataset that only use easy terms
*/
const spaces = /[ ,."?!;:\-–“„]/g;
const run = () => {
  fs.readFile(
    __basedir + `/build/vocabulary_database.json`,
    "utf8",
    (err, data) => {
      const vocabulary = JSON.parse(data);
      fs.readFile(
        path.resolve(
          __basedir + "./../Desktop/Ylhýruskjöl/Línur_úr_Facebook_samræðum.txt"
        ),
        "utf8",
        async (err, data) => {
          let sortKeys = await getSortKeys(true);
          Object.keys(vocabulary.cards).forEach((card_id) => {
            /* Hei þetta split() virkar ekki... */
            [
              getPlaintextFromFormatted(vocabulary.cards[card_id].is_formatted),
              "lemmas",
              "alternative_id",
            ].forEach((c) => {
              c.split(/[;,]+/g).forEach((s) => {
                const j = getHash(s.replace("%", ""), { skip_hash: true });
                if (!(j in sortKeys)) {
                  sortKeys[j] = 1000 * (vocabulary.cards[card_id].level || 6);
                }
              });
            });
          });

          let known_words = {};
          let words_in_course = {};
          Object.keys(sortKeys).forEach((sentence) => {
            sentence
              .toLowerCase()
              .split(spaces)
              .forEach((word) => {
                const sort_key = sortKeys[sentence];
                known_words[word] = Math.min(
                  known_words[word] || 2000,
                  sort_key
                );
                if (sort_key < 1000) {
                  words_in_course[word] = true;
                }
              });
          });

          let matches = [];
          let seen = [];
          let word_frequency = {};
          data
            .split("\n")
            .filter(Boolean)
            .forEach((full_line) => {
              full_line
                .split(/[.!;:?]+/)
                .filter(Boolean)
                .forEach((line) => {
                  line = line.replace(/\s+/g, " ").trim();
                  if (!line) return;
                  const lower = getHash(line, { skip_hash: true }) || "";
                  let max_sortkey = 0;
                  let fail = false;
                  if (lower in sortKeys) return;
                  // console.log(line);
                  // if (i > 5) process.exit();
                  const split = lower.split(spaces);
                  if (split.length <= 2) return;
                  split.forEach((word) => {
                    if (word in known_words) {
                      max_sortkey = Math.max(max_sortkey, known_words[word]);
                    } else {
                      fail = true;
                    }
                    word_frequency[word] = (word_frequency[word] || 0) + 1;
                  });
                  if (!fail && !seen.includes(lower)) {
                    seen.push(lower);
                    matches.push({ line, sort_key: max_sortkey });
                  }
                });
            });
          console.log("data:" + data.length);
          console.log("word_frequency:" + Object.keys(word_frequency).length);
          fs.writeFileSync(
            __basedir + "/../Desktop/Ylhýruskjöl/Missing_words.txt",
            Object.keys(word_frequency)
              .sort((a, b) => word_frequency[b] - word_frequency[a])
              // .filter((a) => word_frequency[a] > 10 && !(a in words_in_course))
              .filter((a) => !(a in known_words))
              .join("\n"),
            () => {}
          );
          fs.writeFileSync(
            __basedir +
              "/../Desktop/Ylhýruskjöl/Setningar úr orðum sem eru í námskeiðinu.txt",
            matches
              .sort((a, b) => a.sort_key - b.sort_key)
              // .map((j) => j.line)
              .map(
                (j) =>
                  j.line +
                  " ".repeat(Math.max(0, 50 - j.line.length)) +
                  " (" +
                  j.sort_key +
                  ")"
              )
              .join("\n"),
            () => {}
          );
          console.log("Done");
          process.exit();
        }
      );
    }
  );
};
run();
