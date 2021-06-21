/*
  To run:
  npm run vocabulary
*/
import axios from "axios";
import query from "server/database";
import sql from "server/database/functions/SQL-template-literal";
import stable_stringify from "json-stable-stringify";
import {
  clean_string,
  getHash,
  getHashesFromCommaSeperated,
} from "./functions";
const path = require("path");
const fs = require("fs");

require("src/app/App/functions/array-foreach-async");
let google_docs_url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQNFtYReGKVwCT6GshjOJKF-OmTt3ZU_9QHJcpL7UpNVMIZ18T0P1PaSXpqv4rvd76z5qAQ1hui9Vy6/pub?output=tsv&random=${Math.random()}`;
let TESTING = false;
if (process.argv[3] === "--testing") {
  /* Spænska */
  google_docs_url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vT_pzDyG0wMUZbPK9yf_i4AYrKjbKs6nFmexJMK5s6IsdIRQk96uP77GDqyiR-FvSCgjBaUFMh3DlYw/pub?output=tsv&random=${Math.random()}`;
  TESTING = true;
}

/*
  Convert vocabulary data into a JavaScrip object
*/
const run = async () => {
  let terms = {};
  let cards = {};
  let dependencies = {};
  let alternative_ids = {};

  const TermsToCardId = (_terms, id) => {
    _terms.forEach((term) => {
      if (!terms[term]) {
        terms[term] = {
          level: null,
          cards: [],
        };
      }
      terms[term].cards.push(id);
    });
  };
  const AddToDependencyGraph = (first, second, type) => {
    if (!second || second.length === 0) return;
    let obj = dependencies;
    if (type === "alt_ids") {
      obj = alternative_ids;
    }
    first.forEach((id) => {
      obj[id] = [...(obj[id] || []), ...second];
    });
  };

  const { data } = await axios.get(google_docs_url);
  // console.log(data.split('\n')[0].split('\t'))
  // return;

  /* Read the table header to get the names of columns */
  let column_indexes_to_name = {};
  data
    .split("\n")[0]
    .split("\t")
    .forEach((name, index) => {
      if (!name.trim()) return;
      column_indexes_to_name[index] = name.trim();
    });
  // let out = [];
  data
    .split("\n")
    .slice(1) // Remove header
    // .slice(0, 100) // TEMP!!!
    .forEach((line, line_number) => {
      /**
       * ------------------------------
       *         PROCESS LINE
       * ------------------------------
       */
      let to_add = [];

      /* Assign names to columns */
      let columns = {};
      line.split("\t").forEach((string, index) => {
        if (!column_indexes_to_name[index]) return;
        columns[column_indexes_to_name[index]] = string.trim() || null;
      });
      // out.push(columns);
      // return;

      // console.log(columns)
      // process.exit()

      const icelandic = clean_string(columns.icelandic);
      const english = clean_string(columns.english);
      if (!icelandic) return;
      if (!english) return;
      if (columns.should_teach === "no") return;
      if (!columns.level && !TESTING) return;

      /* Can have multiple */
      let icelandic_strings = [];
      icelandic.split(/(.+?[^\\])([,;])/g).forEach((i) => {
        i = i.trim();
        if (!i) return;
        if (i === "," || i === ";") return;
        i = clean_string(i);
        icelandic_strings.push(i);
      });
      const terms_in_this_line = icelandic_strings.map(getHash);
      const alternative_ids = getHashesFromCommaSeperated(
        columns.alternative_id
      );
      const depends_on = [
        ...getHashesFromCommaSeperated(columns.depends_on),
        ...getHashesFromCommaSeperated(columns.basic_form),
      ];

      AddToDependencyGraph(terms_in_this_line, depends_on);
      AddToDependencyGraph(alternative_ids, terms_in_this_line, "alt_ids");

      let card_skeleton = {
        en: english,
        terms: terms_in_this_line,
        level: columns.level,
        sort: line_number,
        basic_form: columns.basic_form,
        note_bfr_show: columns.note_bfr_show,
        note_after_show: columns.note_after_show,
        literally: columns.literally,
      };

      if (
        columns.direction &&
        columns.direction !== "<-" &&
        columns.direction !== "->"
      ) {
        throw new Error(`Unknown direction ${columns.direction}`);
      }

      /* Icelandic to English */
      if (columns.direction !== "<-") {
        icelandic_strings.forEach((i) => {
          to_add.push({
            is: i,
            from: "is",
            id: getHash(i) + "_is",
            ...card_skeleton,
          });
        });
      }

      /* English to Icelandic */
      if (columns.direction !== "->") {
        to_add.push({
          is: clean_string(icelandic),
          from: "en",
          id: getHash(icelandic) + "_en",
          ...card_skeleton,
        });
      }

      to_add.forEach(({ id, ...card }) => {
        if (cards[id]) return console.log(`"${icelandic}" already exists`);
        // [...terms_in_this_line, ...alternative_ids].forEach(j => {
        //   termsToCardIds[j] = [
        //     ...(termsToCardIds[j] || []),
        //     card.id
        //   ]
        // })
        // termDependsOnTerms[card.id] = terms_in_this_line
        TermsToCardId(terms_in_this_line, id);
        cards[id] = {
          id,
          ...card,
        };
      });
    });
  console.log(`${Object.keys(cards).length} cards`);

  // fs.writeFileSync(
  //   __basedir + "/build/vocabulary_database2.json",
  //   JSON.stringify(out, null, 2),
  //   function () {}
  // );
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
};

// const format_string = (i) => i
// .replace(/\\,/g, ',')
// .replace(/'''(.+)'''/g, '<strong>$1</strong>')
// .replace(/''(.+)''/g, '<em>$1</em>')
// .trim()

run();
