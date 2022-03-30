"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isDev_1 = require("app/app/functions/isDev");
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const links_1 = require("server/content/links");
const router = require("express").Router();
router.post("/translator/saveDocument", (req, res) => {
    if (!isDev_1.isDev)
        return;
    const { title, text } = req.body;
    let { filepath } = (0, links_1.getValuesForURL)("Data:" + title);
    if (!filepath) {
        filepath = path_1.default.resolve(process.env.PWD, "./../ylhyra_content/data/${FileSafeTitle(title).md");
    }
    fs_1.default.writeFile(filepath, `---\ntitle: Data:${title}\n---\n\n` + text, (err) => {
        if (err)
            throw err;
        res.sendStatus(200);
        (0, child_process_1.exec)(`cd ${process.env.PWD}/../ylhyra_content/ && git add ${filepath} && git commit -m 'Saving data for ${title.replaceAll("'", "")}'`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            // console.log(`stdout: ${stdout}`);
            // console.error(`stderr: ${stderr}`);
        });
    });
});
exports.default = router;
