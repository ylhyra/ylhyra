"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._deck = void 0;
/*
  To run:
  npm run vocabulary
*/
const functions_1 = require("maker/vocabulary_maker/compile/functions");
const parse_vocabulary_file_1 = require("maker/vocabulary_maker/compile/parse_vocabulary_file");
const paths_backend_1 = require("server/paths_backend");
const simplify_1 = require("server/vocabulary/compile/simplify");
const sortKeys_1 = __importDefault(require("server/vocabulary/sortKeys"));
const underscore_1 = __importDefault(require("underscore"));
const fs = require("fs");
// const DECK = "_da";
const DECK = process.env.DECK || "";
const filename = paths_backend_1.content_folder + `/not_data/vocabulary/vocabulary${DECK}.yml`;
const yaml = require("js-yaml");
// console.log(process.env.DECK);
// process.exit();
/*
  Convert vocabulary data into a JavaScript object
*/
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Making vocabulary... ${DECK}`);
    const sortKeys = yield (0, sortKeys_1.default)();
    fs.readFile(filename, "utf8", (err, data) => {
        const { terms, dependencies, alternative_ids, cards, sound } = (0, parse_vocabulary_file_1.parse_vocabulary_file)(yaml.load(data), sortKeys);
        const sound_lowercase = sound.map((j) => (Object.assign(Object.assign({}, j), { recording_of: (0, functions_1.GetLowercaseStringForAudioKey)(j.recording_of) })));
        Object.keys(cards).forEach((card_id) => {
            var _a, _b;
            const card = cards[card_id];
            // console.log(cardInSession);
            // process.exit();
            /* Delete junk cards */
            if (!card.en_plaintext ||
                card.should_teach === "no" ||
                card.fix ||
                card.eyða ||
                (!DECK && !card.level)) {
                delete cards[card_id];
            }
            card.sound = getSounds(card.spokenSentences, sound_lowercase);
            card.isSentence =
                card.is_plaintext.length > 8 &&
                    card.is_plaintext.charAt(0) ===
                        card.is_plaintext.charAt(0).toUpperCase() &&
                    ((_b = (_a = card.is_plaintext.match(/^([^;(]+)/)) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.includes(" "));
            delete card.spokenSentences;
            // card.siblingCardIds = [];
            // card.terms.forEach((term_id) => {
            //   terms[term_id].cards.forEach((card_id) => {
            //     if (card_id !== card.id) {
            //       card.siblingCardIds.push(card_id);
            //     }
            //   });
            // });
            // card.siblingCardIds = _.sortBy(_.uniq(card.siblingCardIds));
            delete card.is_plaintext;
            delete card.en_plaintext;
            Object.keys(card).forEach((j) => {
                if (!card[j]) {
                    delete card[j];
                }
            });
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
        /* Delete unneeded terms & dependencies */
        Object.keys(terms).forEach((term) => {
            let out = [];
            terms[term].cards.forEach((card_id) => {
                if (card_id in cards) {
                    out.push(card_id);
                }
            });
            if (out.length >= 1) {
                terms[term].cards = out;
            }
            else {
                delete terms[term];
            }
        });
        Object.keys(dependencies).forEach((from_term) => {
            let out = [];
            dependencies[from_term].forEach((to_term) => {
                if (to_term in terms) {
                    out.push(to_term);
                }
            });
            if (out.length >= 1) {
                dependencies[from_term] = out;
            }
            else {
                delete dependencies[from_term];
            }
        });
        console.log(`${Object.keys(cards).length} cards`);
        const full_deck = {
            cards,
            terms,
            dependencies,
            alternative_ids,
        };
        exports._deck = full_deck;
        if (!DECK) {
            fs.writeFileSync(__basedir + `/build/vocabulary/alternative_ids.json`, JSON.stringify(alternative_ids, null, ""), function () { });
        }
        fs.writeFileSync(__basedir + `/build/vocabulary/vocabulary_database${DECK}.json`, JSON.stringify((0, simplify_1.simplify)(full_deck), null, ""), function () { });
        // const simplified = simplify(full_deck);
        // fs.writeFileSync(
        //   __basedir + `/build/vocabulary/vocabulary_terms${DECK}.json`,
        //   JSON.stringify(simplified.terms, null, ""),
        //   function () {}
        // );
        // fs.writeFileSync(
        //   __basedir + `/build/vocabulary/vocabulary_cards${DECK}.json`,
        //   JSON.stringify(simplified.cards, null, ""),
        //   function () {}
        // );
        console.log("Done!");
        process.exit();
    });
});
run();
const getSounds = (sentences, sound_lowercase) => {
    let output = [];
    sentences.forEach((i) => {
        const b = (0, functions_1.GetLowercaseStringForAudioKey)(i);
        let s = sound_lowercase
            .filter((k) => k.recording_of === b)
            .map((j) => j.filename.replace(/\.mp3$/, ""));
        output = output.concat(underscore_1.default.shuffle(s));
    });
    if (output.length > 0)
        return output;
    return null;
};
// const DeleteDependency = (from_term, to_term) => {
//   deck.dependencies[from_term] = deck.dependencies[from_term].filter(
//     (j) => j !== to_term
//   );
// };
