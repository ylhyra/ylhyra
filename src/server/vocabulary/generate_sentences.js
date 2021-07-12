import getSortKeys from "./sortKeys";
import { getHash } from "app/VocabularyMaker/functions";
import { content_folder } from "paths_backend";
import _ from "underscore";
const fs = require("fs");
const path = require("path");
const filename = content_folder + `/not_data/vocabulary/vocabulary`;
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
        path.resolve(__basedir + "./../Desktop/Ylhýruskjöl/LÍNUR.txt"),
        "utf8",
        async (err, data) => {
          let sortKeys = await getSortKeys(true);
          Object.keys(vocabulary.cards).forEach((card_id) => {
            vocabulary.cards[card_id].is_plaintext.split(";+").forEach((s) => {
              const j = getHash(s, true);
              if (!(j in sortKeys)) {
                sortKeys[j] = 1000;
              }
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
                  const lower = getHash(line, true) || "";
                  let max_sortkey = 0;
                  let fail = false;
                  if (lower in sortKeys) return;
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
          fs.writeFileSync(
            __basedir + "./../Desktop/Ylhýruskjöl/Orðtíðni.txt",
            Object.keys(word_frequency)
              .sort((a, b) => word_frequency[b] - word_frequency[a])
              .filter((a) => word_frequency[a] > 10 && !(a in words_in_course))
              .join("\n"),
            (err) => {}
          );
          fs.writeFileSync(
            __basedir +
              "./../Desktop/Ylhýruskjöl/Setningar úr orðum sem eru í námskeiðinu.txt",
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
            (err) => {}
          );
          console.log("Done");
          process.exit();
        }
      );
    }
  );
};
run();
