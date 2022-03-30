"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDev = exports.log = void 0;
const isBrowser_1 = require("app/app/functions/isBrowser");
const isDev_1 = require("app/app/functions/isDev");
/**
 * Helper functions for debugging
 * Log for everyone
 */
const log = (...items) => {
    items.forEach((item) => {
        if (typeof item === "string" && isBrowser_1.isBrowser) {
            console.log("%c " + item, "color: #CBCBCB");
        }
        else {
            console.log(item);
        }
    });
};
exports.log = log;
/**
 * Log in development mode
 */
const logDev = (...items) => {
    if (isDev_1.isDev) {
        (0, exports.log)(...items);
    }
};
exports.logDev = logDev;
