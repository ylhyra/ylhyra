"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticCached = exports.cacheControl = void 0;
const time_1 = require("app/app/functions/time");
const express_1 = __importDefault(require("express"));
const cacheControl = (res, type) => {
    // if (isDev) return;
    let directives = {
        "stale-if-error": 365 * time_1.days,
    };
    if (type === "immutable") {
        directives["immutable"] = true;
        directives["max-age"] = 365 * time_1.days;
    }
    else if (type === "html" || type === "cached_html") {
        directives["public"] = true;
        directives["max-age"] = 10 * time_1.seconds;
        directives["s-maxage"] = 1 * time_1.minute;
        directives["stale-while-revalidate"] = 10 * time_1.minutes;
        if (type === "cached_html") {
            directives["s-maxage"] = 1 * time_1.day;
            directives["max-age"] = 12 * time_1.hours;
        }
    }
    let output = [];
    Object.keys(directives).forEach((key) => {
        if (directives[key] === true) {
            output.push(key);
        }
        else {
            if (typeof directives[key] === "number") {
                /* Turn milliseconds into seconds */
                directives[key] /= time_1.second;
            }
            output.push(key + "=" + directives[key]);
        }
    });
    res.set("Cache-Control", output.join(", "));
};
exports.cacheControl = cacheControl;
const staticCached = (path) => {
    return express_1.default.static(path, {
        setHeaders: (res) => {
            (0, exports.cacheControl)(res, "immutable");
        },
    });
};
exports.staticCached = staticCached;
