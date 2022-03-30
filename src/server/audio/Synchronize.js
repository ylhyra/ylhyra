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
const child_process_1 = require("child_process");
const file_extension_1 = __importDefault(require("file-extension"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const server_1 = require("server");
const shortid_1 = __importDefault(require("shortid"));
const router = require("express").Router();
/*
  TODO: This should be put as a queued process
*/
router.post("/audio/synchronize", (req, res) => {
    const { filename, xml } = req.body;
    if (!filename || !xml) {
        res.status(400);
        // console.log({lang,audio_file,xml})
        res.send(`Missing parameters`);
    }
    else {
        // TEMP
        DownloadFile(filename, res, (filepath) => {
            synchronize({ filepath, xml }, res);
        });
        // res.sendStatus(200)
    }
});
const DownloadFile = (filename, res, callback) => {
    const tmp_filepath = path_1.default.resolve(server_1.upload_path, `tmp_${shortid_1.default.generate()}.${(0, file_extension_1.default)(filename)}`);
    (0, child_process_1.exec)(` curl -sS -L "" --output ${tmp_filepath} `, (err, stdout, stderr) => {
        if (err || stderr) {
            console.error(err || stderr);
            res.status(500);
            res.send({ error: err || stderr });
        }
        else {
            callback(tmp_filepath);
        }
    });
};
/**
  Here we use [Aeneas](https://github.com/readbeyond/aeneas)
  to automatically synchronize audio and text.
*/
const synchronize = ({ lang, filepath, xml }, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tmp_name = `tmp_${shortid_1.default.generate()}`;
    const LANGUAGE = lang || "isl"; // Three letter ISO 639-3 language code
    const AUDIO_FILE_PATH = filepath;
    const INPUT_XML = path_1.default.resolve(server_1.upload_path, `${tmp_name}.xhtml`);
    const OUTPUT_JSON = path_1.default.resolve(server_1.upload_path, `${tmp_name}.json`);
    // console.log(xml)
    // console.log(INPUT_XML)
    yield new Promise((resolve) => {
        fs_1.default.writeFile(INPUT_XML, `<xml id="root">${xml}</xml>`, (err) => {
            if (err)
                throw err;
            resolve();
        });
    });
    try {
        yield new Promise((resolve, reject) => {
            let command = "";
            /* SENTENCE LEVEL */
            if (true) {
                command =
                    ` python -m aeneas.tools.execute_task ` +
                        `  ${AUDIO_FILE_PATH} ` +
                        `  ${INPUT_XML} ` +
                        `  "task_language=${LANGUAGE}|` +
                        `os_task_file_format=json|` +
                        `is_text_type=unparsed|` +
                        `is_text_unparsed_id_sort=unsorted|` +
                        `is_text_unparsed_id_regex=s[A-Za-z0-9_\\-]+"` +
                        ` ${OUTPUT_JSON} `;
            }
            else {
                /* WORD LEVEL */
                command =
                    ` python -m aeneas.tools.execute_task ` +
                        `  ${AUDIO_FILE_PATH} ` +
                        `  ${INPUT_XML} ` +
                        `  "task_language=${LANGUAGE}|` +
                        `os_task_file_format=json|` +
                        `is_text_type=munparsed|` +
                        `is_text_munparsed_l1_id_regex=root|` +
                        `is_text_munparsed_l2_id_regex=s[A-Za-z0-9_\\-]+|` +
                        `is_text_munparsed_l3_id_regex=w[A-Za-z0-9_\\-]+"` +
                        ` ${OUTPUT_JSON} ` +
                        ` --presets-word`;
            }
            (0, child_process_1.exec)(command, (err, stdout, stderr) => {
                if (stderr) {
                    console.error(stderr);
                    reject(stderr);
                }
                else if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    catch (e) {
        res.status(500);
        return res.send(e);
    }
    const json = yield new Promise((resolve) => {
        fs_1.default.readFile(OUTPUT_JSON, "utf8", (err, data) => {
            if (err)
                throw err;
            // console.log(data)
            resolve(data);
        });
    });
    res.send(json);
    fs_1.default.unlink(OUTPUT_JSON, () => { });
    fs_1.default.unlink(INPUT_XML, () => { });
    fs_1.default.unlink(AUDIO_FILE_PATH, () => { });
});
exports.default = router;
