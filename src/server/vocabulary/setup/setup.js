/*
  To run:
  npm run vocabulary
*/
import axios from "axios";
import query from "server/database";
import sql from "server/database/functions/SQL-template-literal";
import stable_stringify from "json-stable-stringify";
import { parse_vocabulary_file } from "app/VocabularyMaker/functions.js";
import { content_folder } from "paths_backend";
// import {
//   clean_string,
//   getHash,
//   getHashesFromCommaSeperated,
// } from "./functions";
const path = require("path");
const fs = require("fs");
const filename = content_folder + "/not_data/vocabulary/vocabulary.yml";
const yaml = require("js-yaml");

/*
  Convert vocabulary data into a JavaScrip object
*/
const run = async () => {
  fs.readFile(filename, "utf8", (err, data) => {
    console.log(data.slice(0, 30));
    const { terms, dependencies, alternative_ids, raw_sentences, cards } =
      parse_vocabulary_file(yaml.load(data));

    Object.keys(cards).forEach((card_id) => {
      const card = cards[card_id];
      if (!card.english || !card.level) {
        delete cards[card_id];
      }
    });

    console.log(`${Object.keys(cards).length} cards`);

    fs.writeFileSync(
      __basedir + "/build/vocabulary_database.json",
      JSON.stringify(
        {
          cards,
          terms,
          dependencies,
          alternative_ids,
        },
        null,
        2
      ),
      function () {}
    );
    console.log("Done 1");
    process.exit();
  });
};

run();
