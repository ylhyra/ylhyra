"use strict";
/*
  Requests text analysis from
  [Greynir](https://greynir.is/analysis),
  a sentence analyzer for Icelandic
  by Vilhjálmur Þorsteinsson.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const database_1 = __importDefault(require("server/database"));
const string_hash_1 = __importDefault(require("string-hash"));
const lang = "isl";
function default_1(text, callback) {
    const text_hash = (0, string_hash_1.default)(text).toString(36);
    (0, database_1.default)(`SELECT * FROM analysis WHERE lang = ? AND text_hash = ?`, [lang, text_hash], (err, results) => {
        if (err) {
            console.error(err);
            callback(null);
        }
        else {
            if (results.length > 0) {
                callback(JSON.parse(results[0].analysis));
            }
            else {
                request_1.default.post({
                    url: "https://greynir.is/postag.api/v1",
                    form: {
                        text: text,
                    },
                }, (error, response, body) => {
                    // console.log(body)
                    if (error) {
                        console.error(err);
                        callback(null);
                    }
                    else {
                        (0, database_1.default)(`INSERT INTO analysis SET
              lang = ?,
              text_hash = ?,
              text = ?,
              analysis = ?;
              `, [lang, text_hash, text, JSON.stringify(JSON.parse(body))], (err) => {
                            if (err) {
                                console.error(err);
                                callback(null);
                            }
                            else {
                                callback(JSON.parse(body));
                            }
                        });
                    }
                });
            }
        }
    });
}
exports.default = default_1;
