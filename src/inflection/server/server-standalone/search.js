"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
exports.default = (options, callback) => {
    let { word, fuzzy, return_rows_if_only_one_match } = options;
    axios_1.default
        .get("https://ylhyra.is/api/inflection", {
        params: {
            search: word,
            fuzzy,
            return_rows_if_only_one_match,
        },
    })
        .then(function ({ data }) {
        callback(data.results);
    })
        .catch(function (error) {
        callback(null);
        console.log(error);
    });
};
