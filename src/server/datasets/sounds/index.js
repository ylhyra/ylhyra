"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("server/database"));
exports.default = (input) => {
    if (!input || !input.trim())
        return;
    input = input.toLowerCase().trim();
    return new Promise((resolve) => {
        if (input.length < 50) {
            (0, database_1.default)("SELECT file FROM sounds WHERE text = ?", [input], (error, results) => {
                if (error)
                    throw error;
                const files = results
                    .map((i) => i.file)
                    .map((i) => {
                    if (i.startsWith("islex/")) {
                        return "https://media.egill.xyz/audio/" + i;
                    }
                    else {
                        return "https://ylhyra.is/Special:Redirect/file/" + i;
                    }
                });
                resolve(files);
            });
        }
        else {
            resolve();
        }
    });
};
