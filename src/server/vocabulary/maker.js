"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const removeExtraWhitespace_1 = require("app/app/functions/removeExtraWhitespace");
const rowTitles_1 = require("maker/vocabulary_maker/compile/rowTitles");
const paths_backend_1 = require("server/paths_backend");
const underscore_1 = __importDefault(require("underscore"));
const router = require("express").Router();
const fs = require("fs");
const filename = paths_backend_1.content_folder + `/not_data/vocabulary/vocabulary`;
const yaml = require("js-yaml");
router.post("/vocabulary_maker/get", (req, res) => {
    fs.readFile(filename + (req.body.deckName || "") + ".yml", "utf8", (err, data) => {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            res.send(yaml.load(data));
        }
    });
});
router.post("/vocabulary_maker", (req, res) => {
    if (process.env.NODE_ENV !== "development")
        return res.sendStatus(500);
    let data = req.body.data;
    data = {
        rows: data.rows
            .filter((d) => d.icelandic)
            .sort((a, b) => a.row_id - b.row_id)
            .map((row) => {
            let out = {};
            // delete row.row_id;
            underscore_1.default.uniq([...rowTitles_1.row_titles, "row_id", ...Object.keys(row)]).forEach((key) => {
                if (!row[key])
                    return;
                if (typeof row[key] === "string") {
                    if (!row[key].trim())
                        return;
                    out[key] = (0, removeExtraWhitespace_1.removeExtraWhitespace)(row[key])
                        .replace(/^[,;]+ ?/g, "")
                        .replace(/[,;]+$/g, "")
                        .replace(/ [–—] /g, " - ");
                }
                else {
                    out[key] = row[key];
                }
            });
            return out;
        }),
        sound: data.sound.map((j) => {
            delete j.lowercase;
            return j;
        }),
    };
    const y = yaml.dump(data, { lineWidth: -1, quotingType: '"' });
    fs.writeFile(filename + (req.body.deckName || "") + ".yml", y, (err) => {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            res.sendStatus(200);
        }
    });
    // /* Backup */
    // fs.writeFile(
    //   content_folder +
    //     `/not_data/vocabulary/BACKUP/vocabulary${
    //       req.body.deckName || ""
    //     }.${new Date().getTime()}.yml`,
    //   y,
    //   () => {}
    // );
});
exports.default = router;
