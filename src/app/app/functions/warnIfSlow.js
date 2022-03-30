"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warnIfSlow = void 0;
const isDev_1 = require("app/app/functions/isDev");
let l = {};
exports.warnIfSlow = {
    start: (name) => {
        if (!isDev_1.isDev)
            return;
        l[name] = performance.now();
    },
    end: (name, max = 30) => {
        if (!isDev_1.isDev)
            return;
        if (l[name]) {
            const time = performance.now() - l[name];
            if (time > max) {
                console.warn(`"${name}" took ${Math.round(time)}ms`);
            }
        }
    },
};
