"use strict";
/*

  Transliterates Icelandic phonetic transcriptions
  into English approximations of sounds.

  Based on [The Icelandic Pronunciation dataset](http://malfong.is/?pg=framburdur)
  by Eiríkur Rögnvaldsson

*/
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
const database_1 = __importDefault(require("server/database"));
const underscore_1 = __importDefault(require("underscore"));
const wordRegex = /([A-zÀ-ÿ·-]+)/g;
const IPA_to_English = [
    ["ji", "yi"],
    ["ju", 'y<span class="close-back-rounded-vowel">oo</span>'],
    ["ɛj", "ei"],
    ["j", "y"],
    ["kʰ", "k"],
    ["k", "g"],
    ["l̥", '<span class="h">h</span>l'],
    ["r̥", '<span class="h">h</span>r'],
    ["tʰ", "t"],
    ["ntl", "ndl"],
    ["tl", "tl"],
    ["t", "d"],
    ["x", '<span class="voiceless-velar-fricative">k</span>'],
    ["au", 'a<span class="close-back-rounded-vowel">oo</span>'],
    ["ei", "ei"],
    ["ou", "ou"],
    ["œi", '<span class="open-mid-front-rounded-vowel">u</span>y'],
    ["ɣ", '<span class="voiced-velar-fricative">ɣ</span>'],
    ["r̥c", '<span class="h">h</span>rk'],
    ["cʰ", "ky"],
    ["hc", '<span class="h">h</span>k'],
    ["c(?=ɪ)", "g"],
    ["c", "gy"],
    ["ai", "ai"],
    ["i", '<span class="close-front-unrounded-vowel">ee</span>'],
    ["pʰ", "p"],
    ["p", "b"],
    ["u", '<span class="close-back-rounded-vowel">oo</span>'],
    ["ɛ", "e"],
    ["ʏ", "u"],
    ["ɔ", "o"],
    [":", ""],
    ["ɪ", "i"],
    ["ð", '<span class="eth">th</span>'],
    ["θ", '<span class="thorn">th</span>'],
    ["m̥", "hm"],
    ["n̥", '<span class="h">h</span>(n)'],
    ["ɲ̊", '<span class="h">h</span>(n)'],
    ["ɲ", "(n)"],
    ["ŋ̊", '<span class="h">h</span>(n)'],
    ["ŋ̥", '<span class="h">h</span>(n)'],
    ["ŋ", "(n)"],
    ["œ", '<span class="open-mid-front-rounded-vowel">u</span>'],
    ["ʰ", '<span class="h">h</span>'],
    ["ç", '<span class="voiceless-palatal-fricative">hy</span>'], // hjá
];
exports.default = (input) => {
    input = input.toLowerCase().trim();
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const output = yield splitIntoWords(input);
            if (output.match(/{{MISSING}}/) || isReduntant(input, output)) {
                resolve(null);
            }
            else {
                resolve(output);
            }
        }
        catch (e) {
            console.error(e);
            resolve(null);
        }
    }));
};
/*
  Checks if the sound transcription
  is just exactly the same as the input,
  so it will be reduntant to show the transcription.
*/
const isReduntant = (input, output) => {
    input = input.replace(/(.)\1+/g, "$1"); // Remove repeating characters
    output = output.replace(/<.*?>/g, "").replace(/[()]/g, ""); // Remove tags and parentheses
    return input === output;
};
const splitIntoWords = (input) => {
    return new Promise((callback) => __awaiter(void 0, void 0, void 0, function* () {
        const text = input
            .toLowerCase()
            .replace(/[-·'"`!?()]/g, " ")
            .replace(/\u00AD/g /* Soft hyphens */, "")
            .trim();
        const split = text.split(wordRegex);
        let results = [];
        yield split
            .filter((i) => i.length < 50)
            .forEachAsync((word, i) => __awaiter(void 0, void 0, void 0, function* () {
            yield new Promise((resolve) => {
                if (word.match(wordRegex)) {
                    lookup(word, (pronunciation) => {
                        results[i] = `${pronunciation}`;
                        resolve();
                    });
                }
                else {
                    if (word !== "") {
                        results[i] = `<span class="punctuation">${word}</span>`;
                    }
                    resolve();
                }
            });
        }));
        callback(results.join(""));
    }));
};
const lookup = (input, callback) => {
    (0, database_1.default)("SELECT * FROM pronunciation WHERE word = ?", [input], (error, results) => {
        if (error)
            throw error;
        if (results.length) {
            if (results[0].guessed) {
                callback(`<span class="guessed">${apply_replacements(results[0].pronunciation)}</span>`);
            }
            else {
                callback(apply_replacements(results[0].pronunciation));
            }
        }
        else {
            Guess_IPA(input, (results) => {
                if (results) {
                    save_guess(input, results, () => {
                        callback(`<span class="guessed">${apply_replacements(results)}</span>`);
                    });
                }
                else {
                    callback("{{MISSING}}");
                }
            });
        }
    });
};
/*
  If this word doesn't exist, attempt to
  figure out an IPA transcription ourselves.
  Works well for compound words.
*/
const Guess_IPA = (input, callback) => {
    /*
      Finds ALL possible ways to split this word
    */
    let select = [];
    for (var start = 0; start <= input.length; start++) {
        for (var end = 1; start + end <= input.length; end++) {
            const word = input.substr(start, end);
            if (word.length > 1 ||
                (word.length === 1 && /[aeioóú]/.test(word)) /* Vowels can be single */) {
                select.push(` word = '${word}' `);
            }
        }
    }
    select = underscore_1.default.uniq(select).join(" OR ");
    (0, database_1.default)(`SELECT * FROM pronunciation WHERE (${select}) AND guessed IS NULL ORDER BY LENGTH(word) DESC`, (error, results) => {
        if (error) {
            console.error(error);
        }
        var list = {};
        for (let i = 0; i < results.length; i++) {
            list[results[i].word] = results[i].pronunciation;
        }
        /*
        Calculate score based on
      */
        const returns = FindPossibleWaysToFit(input, list)
            .map((possibility) => {
            const split = possibility.text.split("-");
            const parts = split.length;
            const average_part_length = split
                .map((part) => part.length)
                .reduce((p, c) => {
                return p + c;
            }) / split.length;
            const einstæðar = split.filter((part) => part.length === 1).length;
            const tvístæðar = split.filter((part) => part.length === 2).length;
            const þrístæðar = split.filter((part) => part.length === 3).length;
            const score = average_part_length /
                parts /
                (1 + einstæðar + tvístæðar * 0.4 + þrístæðar * 0.1);
            return {
                text: possibility.text,
                pronunciation: possibility.pronunciation,
                score: score,
            };
        })
            //.sort((p, c) => { return c.score - p.score }).slice(0, 4)
            .reduce((p, c) => {
            return p.score > c.score ? p : c;
        }, {});
        callback(returns.pronunciation);
    });
};
/*
  Fits sound parts to word.

  Returns all possibilities, for example:
    - innanríkis-ráðherra
    - innan-ríkis-ráðherra
    - innan-ríkis-ráð-herra
*/
const FindPossibleWaysToFit = (input, list) => {
    let possibilities = [];
    for (var end = 1; end <= input.length; end++) {
        const text = input.substr(0, end);
        if (list[text]) {
            if (end === input.length) {
                possibilities.push({
                    text: text,
                    pronunciation: list[text],
                });
            }
            else {
                FindPossibleWaysToFit(input.substr(end), list).forEach((l) => {
                    possibilities.push({
                        text: text + "-" + l.text,
                        pronunciation: list[text] + l.pronunciation,
                    });
                });
            }
        }
    }
    return possibilities;
};
const save_guess = (word, pronunciation, callback) => {
    (0, database_1.default)(`INSERT INTO pronunciation (word,pronunciation,guessed) VALUES ('${word}', "${pronunciation}", TRUE)`, (error) => {
        if (error)
            throw error;
        callback();
    });
};
/*
  Applies all replacements to the text.
  The first replacements have priority.
  This is done because some replacements would otherwise overlap.
*/
const apply_replacements = (text) => {
    let i, r;
    for (i = 0; i < IPA_to_English.length; i++) {
        if (IPA_to_English[i][0] === "")
            continue;
        r = new RegExp(IPA_to_English[i][0], "g");
        text = text.replace(r, `~${i}~`);
    }
    for (i = 0; i < IPA_to_English.length; i++) {
        if (IPA_to_English[i][0] === "")
            continue;
        r = new RegExp(`~${i}~`, "g");
        text = text.replace(r, IPA_to_English[i][1]);
    }
    return text;
};
