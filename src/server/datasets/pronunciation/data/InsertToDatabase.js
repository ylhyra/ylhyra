"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
node server/datasets/pronunciation/data/InsertToDatabase.js
*/
const line_by_line_1 = __importDefault(require("line-by-line"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("server/database"));
(0, database_1.default)(`TRUNCATE TABLE pronunciation`, () => {
    var lr = new line_by_line_1.default(path_1.default.resolve(__dirname, "./Icelandic_Pronunciation.csv"));
    lr.on("error", (err) => {
        console.error(err);
    });
    var count = 0;
    lr.on("line", (line) => {
        lr.pause();
        if (/\\/.test(line)) {
            // Rusl-línur
            lr.resume();
        }
        else {
            var split = line.split(",");
            var word = split[0].toLowerCase();
            var pronunciation = split[1];
            (0, database_1.default)(`INSERT INTO pronunciation (word,pronunciation) VALUES ('${word}', "${pronunciation}")`, (error) => {
                if (error)
                    throw error;
                if (count % 1000 === 0) {
                    console.log(word);
                }
                count++;
                lr.resume();
            });
        }
    });
    lr.on("end", () => {
        process.exit();
    });
});
