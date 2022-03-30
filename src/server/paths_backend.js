"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_unprocessed_image_url = exports.ylhyra_content_files = exports.image_output_folder = exports.build_folder = exports.content_folder = void 0;
const paths_1 = require("app/app/paths");
const path_1 = __importDefault(require("path"));
global.__basedir = process.env.PWD;
/* Folders */
exports.content_folder = path_1.default.resolve(__basedir, "./../ylhyra_content");
exports.build_folder = __basedir + "/build";
exports.image_output_folder = exports.build_folder + "/images";
exports.ylhyra_content_files = exports.content_folder + "/not_data/files";
const get_unprocessed_image_url = (file) => `${paths_1.unprocessed_image_url}/${encodeURIComponent(file)}`;
exports.get_unprocessed_image_url = get_unprocessed_image_url;
