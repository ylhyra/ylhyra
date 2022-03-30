"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilesRecursivelySync = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// https://stackoverflow.com/a/66187152 CC BY-SA 4.0
const getFilesRecursivelySync = (directory) => {
    let files = [];
    const filesInDirectory = fs_1.default.readdirSync(directory);
    for (const file of filesInDirectory) {
        if (file.startsWith("."))
            continue;
        const absolute = path_1.default.join(directory, file);
        if (fs_1.default.statSync(absolute).isDirectory()) {
            files = files.concat((0, exports.getFilesRecursivelySync)(absolute));
        }
        else {
            if (!file.endsWith(".md"))
                continue;
            files.push(absolute);
        }
    }
    return files;
};
exports.getFilesRecursivelySync = getFilesRecursivelySync;
