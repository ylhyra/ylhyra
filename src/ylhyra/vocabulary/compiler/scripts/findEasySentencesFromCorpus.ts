import fs from "fs";
import path from "path";
import { getPlaintextFromFormatted } from "ylhyra/vocabulary/compiler/parseVocabularyFile/format";
import { getHash } from "ylhyra/vocabulary/compiler/parseVocabularyFile/functions";
import { getBaseDir } from "ylhyra/server/paths";
import { getSortKeysBasedOnWhenWordIsIntroducedInTheCourse } from "ylhyra/vocabulary/compiler/compiler.server/sortKeys.server";

/*
  Finds sentences from dataset that only use terms that are already included in the vocabulary dataset and which are marked as easy
*/
const spaces = /[ ,."?!;:\-–“„]/g;
const run = () => {
  fs.readFile(
    getBaseDir() + `/build/vocabulary_database.json`,
    "utf8",
    (err, data) => {
      const vocabulary = JSON.parse(data);
      fs.readFile(
        path.resolve(
          getBaseDir() +
            "./../Desktop/Ylhýruskjöl/Línur_úr_Facebook_samræðum.txt"
        ),
        "utf8",
        async (err, data) => {
          let sortKeys =
            await getSortKeysBasedOnWhenWordIsIntroducedInTheCourse(/*true*/);
          Object.keys(vocabulary.cards).forEach((cardId) => {
            /* Hei þetta split() virkar ekki... */
            [
              getPlaintextFromFormatted(vocabulary.cards[cardId].is_formatted),
              "lemmas",
              "alternative_id",
            ].forEach((c) => {
              c.split(/[;,]+/g).forEach((s) => {
                const j = getHash(s.replace("%", ""), {
                  skip_hash: true,
                });
                if (!(j in sortKeys)) {
                  sortKeys[j] = 1000 * (vocabulary.cards[cardId].level || 6);
                }
              });
            });
          });

          let knownWords = {};
          let words_in_course = {};
          Object.keys(sortKeys).forEach((sentence) => {
            sentence
              .toLowerCase()
              .split(spaces)
              .forEach((word) => {
                const sort_key = sortKeys[sentence];
                knownWords[word] = Math.min(knownWords[word] || 2000, sort_key);
                if (sort_key < 1000) {
                  words_in_course[word] = true;
                }
              });
          });

          let matches = [];
          let seen = [];
          let wordFrequency = {};
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
                    if (word in knownWords) {
                      max_sortkey = Math.max(max_sortkey, knownWords[word]);
                    } else {
                      fail = true;
                    }
                    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
                  });
                  if (!fail && !seen.includes(lower)) {
                    seen.push(lower);
                    matches.push({ line, sort_key: max_sortkey });
                  }
                });
            });
          console.log("data:" + data.length);
          console.log("word_frequency:" + Object.keys(wordFrequency).length);
          fs.writeFileSync(
            getBaseDir() + "/../Desktop/Ylhýruskjöl/Missing_words.txt",
            Object.keys(wordFrequency)
              .sort((a, b) => wordFrequency[b] - wordFrequency[a])
              // .filter((a) => word_frequency[a] > 10 && !(a in words_in_course))
              .filter((a) => !(a in knownWords))
              .join("\n")
          );
          fs.writeFileSync(
            getBaseDir() +
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
              .join("\n")
          );
          console.log("Done");
          process.exit();
        }
      );
    }
  );
};
run();
