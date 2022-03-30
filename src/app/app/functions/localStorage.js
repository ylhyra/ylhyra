"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFromLocalStorage = exports.saveInLocalStorage = exports.ANALYTICS_LOCALSTORAGE_LABEL = void 0;
const isBrowser_1 = require("app/app/functions/isBrowser");
exports.ANALYTICS_LOCALSTORAGE_LABEL = "_a";
const compressed_keys = [
    "vocabulary-database",
    "vocabulary-user-data",
    "vocabulary-schedule",
    exports.ANALYTICS_LOCALSTORAGE_LABEL,
];
/* Helper functions to stringify in local storage */
const saveInLocalStorage = (name, input) => {
    if (!isBrowser_1.isBrowser)
        return;
    let data;
    if (!input || (Array.isArray(input) && input.length === 0)) {
        data = "";
    }
    else {
        data = JSON.stringify(input);
    }
    // // TODO!! Too slow?
    // if (data && compressed_keys.includes(name)) {
    //   console.time("Data compression");
    //   data = compressToBase64(data);
    //   console.timeEnd("Data compression");
    // }
    // console.time("Saving in localstorage");
    localStorage.setItem(name, data);
    // console.timeEnd("Saving in localstorage");
};
exports.saveInLocalStorage = saveInLocalStorage;
const getFromLocalStorage = (name) => {
    if (!isBrowser_1.isBrowser)
        return;
    let data = localStorage.getItem(name);
    if (!data)
        return null;
    // if (compressed_keys.includes(name) && !data.startsWith("{")) {
    //   data = decompressFromBase64(data) || data;
    // }
    try {
        return JSON.parse(data);
    }
    catch (_a) {
        return null;
    }
};
exports.getFromLocalStorage = getFromLocalStorage;
