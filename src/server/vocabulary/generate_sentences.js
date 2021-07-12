import getSortKeys from "./sortKeys";
import {
  getHash,
  GetLowercaseStringForAudioKey,
} from "app/VocabularyMaker/functions";
import { content_folder } from "paths_backend";
import _ from "underscore";
const fs = require("fs");
const path = require("path");
const filename = content_folder + `/not_data/vocabulary/vocabulary`;
/*
  Finds sentences from dataset that only use easy terms
*/
const spaces = /[ ,.";:\-–“„]/g;
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
              sortKeys[GetLowercaseStringForAudioKey(s)] = 1000;
            });
          });
          let known_words = {};
          Object.keys(sortKeys).forEach((sentence) => {
            sentence
              .toLowerCase()
              .split(spaces)
              .forEach((word) => {
                const sort_key = sortKeys[sentence];
                known_words[word] = Math.max(known_words[word] || 0, sort_key);
              });
          });

          let matches = [];
          let seen = [];
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
                  const lower = GetLowercaseStringForAudioKey(line);
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
                  });
                  if (!fail && !seen.includes(lower)) {
                    seen.push(lower);
                    matches.push({ line, sort_key: max_sortkey });
                  }
                });
            });
          fs.writeFileSync(
            __basedir + "./../Desktop/Ylhýruskjöl/LÍNUR_matches.txt",
            matches
              .sort((a, b) => a.sort_key - b.sort_key)
              .map((j) => j.line)
              // .map((j) => j.line + "   (" + j.sort_key + ")")
              .join("\n"),
            // Object.keys(known_words).join("\n"),
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
