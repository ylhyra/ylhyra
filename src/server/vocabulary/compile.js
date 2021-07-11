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
import generate_html from "documents/Compile";

import atob from "atob";
import { getCardIdsFromWords } from "app/Vocabulary/actions/_functions";
import { getHash } from "app/VocabularyMaker/functions";

const path = require("path");
const fs = require("fs");

// const DECK = "_da";
const DECK = "";
const filename = content_folder + `/not_data/vocabulary/vocabulary${DECK}.yml`;
const yaml = require("js-yaml");
/*
  Convert vocabulary data into a JavaScrip object
*/
const run = async () => {
  console.log("Making vocabulary...");
  /****************
   * Read the page "Course" and find the order of its vocabulary list
   ***************/
  const { content, header } = await generate_html("course");
  let i = 0;
  let sortKeys = {}; /* Term to sortKey */
  content.replace(/header_data="(.+?)"/g, (x, data) => {
    const values = JSON.parse(atob(data));
    if (!values) return;
    values.forEach((value) => {
      value = value.split(" = ")[0];
      const hash = getHash(value);
      if (!(hash in sortKeys)) {
        sortKeys[hash] = Math.round(i / 3);
      }
    });
    i++;
  });

  console.log("Sortkeys generated");

  fs.readFile(filename, "utf8", (err, data) => {
    const { terms, dependencies, alternative_ids, plaintext_sentences, cards } =
      parse_vocabulary_file(yaml.load(data));

    Object.keys(cards).forEach((card_id) => {
      const card = cards[card_id];

      /* Delete junk cards */
      if (
        !DECK &&
        (!card.en_plaintext ||
          !card.level ||
          card.should_teach === "no" ||
          card["Laga?"] ||
          card.eyða)
      ) {
        delete cards[card_id];
      }
    });

    /* Add sortKey */
    for (let [term, sortKey] of Object.entries(sortKeys)) {
      if (term in terms) {
        terms[term].cards.forEach((card_id) => {
          if (cards[card_id]) {
            cards[card_id].sortKey = sortKey;
          }
        });
      }
    }

    console.log(`${Object.keys(cards).length} cards`);

    fs.writeFileSync(
      __basedir + `/build/vocabulary_database${DECK}.json`,
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
