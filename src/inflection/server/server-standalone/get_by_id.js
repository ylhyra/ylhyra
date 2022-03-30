"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
exports.default = (id, callback) => {
    // console.log(id)
    axios_1.default
        .get(`https://ylhyra.is/api/inflection?id=${id}&type=flat`)
        .then(function ({ data }) {
        // console.log(data)
        callback(data.results);
    })
        .catch(function (error) {
        console.log(error);
        callback(null);
    });
};
