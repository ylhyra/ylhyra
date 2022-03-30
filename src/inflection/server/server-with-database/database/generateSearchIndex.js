"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*

  Generates an index for fuzzy search

  Setup:
  Fetch KRISTINsnid.csv from BÍN.
  Then generate a simple list of unique lowercase words with:
  > awk -F ';' '{print $10}' KRISTINsnid.csv | tr '[:upper:]' '[:lower:]' | sort -u > ordalisti.csv
  Then run:
  > node build/server/ylhyra_server.js --generate-search-index



  Scoring:

  * 5 - original word
  * 4 - original word is capitalized
  * 3 - without special characters
  * 2 - major spelling errors
  * 1 - phonetic

*/
const flattenArray_1 = __importDefault(require("app/app/functions/flattenArray"));
const fuzzy_search_1 = require("inflection/server/server-with-database/fuzzy_search");
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("server/database"));
const sqlstring_1 = require("sqlstring");
var LineByLineReader = require("line-by-line");
const CSV_FILE_NAME = "ordalisti.csv";
const CSV_FILE_LINES = 3071707; // Number of lines, calculated with "wc -l"
let count = 0;
// import { compareTwoStrings } from 'string-similarity'
var lr = new LineByLineReader(path_1.default.resolve(__dirname, `./${CSV_FILE_NAME}`));
lr.on("error", (err) => {
    console.error(err);
});
lr.on("line", (line) => {
    lr.pause();
    if (line.trim() === "") {
        lr.resume();
    }
    else {
        const word = line;
        let inputs;
        inputs = [
            {
                text: (0, fuzzy_search_1.cleanInput)(word),
                score: word === (0, fuzzy_search_1.cleanInput)(word) ? 5 : 4,
            },
        ];
        inputs = UniqueByMaxScore(addPhoneticAndSpellingErrors(inputs));
        // inputs = inputs.filter(input => input.score >= 3)
        const values = (0, flattenArray_1.default)(inputs.map((input) => [input.text, word, input.score]));
        (0, database_1.default)(`DELETE FROM autocomplete WHERE output = ${(0, sqlstring_1.escape)(word)};` +
            `INSERT INTO autocomplete SET input = ?, output = ?, score = ?;`.repeat(inputs.length), values, (err, results) => {
            if (err) {
                console.error(err);
                throw err;
            }
            else {
                count++;
                if (count % 100 === 1) {
                    process.stdout.write(`\x1Bc\r${((count / CSV_FILE_LINES) * 100).toFixed(1)}% ${word}`);
                }
                lr.resume();
            }
        });
    }
});
lr.on("end", () => {
    process.exit();
});
const clean = (words) => words.map((word) => ({
    text: (0, fuzzy_search_1.cleanInput)(word.text),
    score: word.score,
}));
const addPhoneticAndSpellingErrors = (inputs) => {
    let additions = [];
    inputs.forEach(({ text, score }) => {
        additions.push({
            text: (0, fuzzy_search_1.without_special_characters)(text),
            score: 3,
        });
        additions.push({
            text: (0, fuzzy_search_1.with_spelling_errors)(text),
            score: 2,
        });
        additions.push({
            text: (0, fuzzy_search_1.phonetic)(text),
            score: 1,
        });
    });
    return [...inputs, ...additions];
};
const UniqueByMaxScore = (inputs) => {
    const sorted = inputs.sort((a, b) => b.score - a.score);
    /* Store array of texts so that we can filter out already-seen ones in the next step */
    const texts = sorted.map((word) => (0, fuzzy_search_1.removeTemporaryMarkers)(word.text));
    return sorted
        .filter((word, index) => index === texts.indexOf((0, fuzzy_search_1.removeTemporaryMarkers)(word.text)))
        .map((word) => ({
        text: word.text,
        score: Math.round(word.score),
    }));
};
// const demo = async () => {
//   const word = 'Þórsmörk'
//   let inputs = [{
//     text: cleanInput(word),
//     score: word === cleanInput(word) ? 100 : 90,
//   }]
//   inputs = UniqueByMaxScore(autocomplete(inputs))
//   inputs = UniqueByMaxScore(addPhoneticAndSpellingErrors(inputs))
//   inputs = inputs.filter(input => input.score >= 3)
//
//   console.log(inputs)
//   process.exit()
// }
// demo()
