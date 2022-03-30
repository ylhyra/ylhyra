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
const html_entities_1 = require("html-entities");
const database_1 = __importDefault(require("server/database"));
const SQL_template_literal_1 = __importDefault(require("server/database/functions/SQL-template-literal"));
const { TranslationServiceClient } = require("@google-cloud/translate").v3beta1;
const { GOOGLE_API_PROJECT_ID } = process.env;
const entities = new html_entities_1.AllHtmlEntities();
exports.default = (translation_hashes) => __awaiter(void 0, void 0, void 0, function* () {
    let done = yield GetFromDatabase(translation_hashes);
    let missing_html = "";
    Object.keys(translation_hashes).forEach((hash) => {
        if (done[hash]) {
            translation_hashes[hash].translation = done[hash].translation;
        }
        else if (translation_hashes[hash].text) {
            missing_html += `<div id=${hash}>${translation_hashes[hash].text}</div>\n`;
        }
    });
    // console.log({done,missing_html})
    // if (missing_html) {
    //   console.log('Sending to Google Translate')
    //   const results = await GetGoogleTranslate(missing_html)
    //   done = { ...done, ...results }
    // }
    // console.log(GOOGLE_API_PROJECT_ID)
    return Promise.resolve(done);
});
const GetFromDatabase = (translation_hashes) => {
    return new Promise((resolve, reject) => {
        let i = "";
        Object.keys(translation_hashes).forEach((hash) => {
            i += (0, SQL_template_literal_1.default) `SELECT hash, translation FROM google_translate WHERE hash = ${hash};`;
        });
        if (!i)
            return resolve({});
        // console.log(i)
        (0, database_1.default)(i, (err, results) => {
            if (err) {
                reject();
            }
            else {
                let output = {};
                // console.log(JSON.stringify(results))
                results.forEach((i) => {
                    if (!i[0])
                        return;
                    output[i[0].hash] = i[0].translation;
                });
                resolve(output);
            }
        });
    });
};
const GetGoogleTranslate = (html) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // return new Promise(async(resolve, reject) => {
    if (!GOOGLE_API_PROJECT_ID)
        return console.error("No Google API project ID");
    const translationClient = new TranslationServiceClient();
    const request = {
        parent: translationClient.locationPath(GOOGLE_API_PROJECT_ID, "global"),
        contents: [html],
        mimeType: "text/html",
        sourceLanguageCode: "is-IS",
        targetLanguageCode: "en-US",
    };
    const [response] = yield translationClient.translateText(request);
    // for (const translation of response.translations) {
    //   // console.log(`Translation: ${translation.translatedText}`)
    // }
    // console.log(response)
    const translatedText = (_a = response === null || response === void 0 ? void 0 : response.translations[0]) === null || _a === void 0 ? void 0 : _a.translatedText;
    let results = {};
    translatedText &&
        translatedText.split(/(<(?:span|div).*?<\/(?:span|div)>)/g).forEach((x) => {
            var y = x.match(/<(?:span|div) id="?(.*?)"?>(.*?)<\/(?:span|div)>/);
            if (!y)
                return null;
            const id = y[1];
            const text = y[2];
            results[id] = entities.decode(text).trim();
        });
    // console.log(results)
    console.log(`Google Translate requested for ${Object.keys(results).length} words`);
    SaveResults(results);
    return results;
});
const SaveResults = (results) => {
    Object.keys(results).forEach((hash) => {
        (0, database_1.default)((0, SQL_template_literal_1.default) `INSERT IGNORE INTO google_translate SET
        hash = ${hash},
        translation = ${results[hash]}
        ;
        `, (err, results) => {
            if (err) {
                console.error(err);
            }
            else {
            }
        });
    });
};
