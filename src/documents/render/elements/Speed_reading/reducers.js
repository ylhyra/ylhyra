"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.speed_reader = void 0;
const isBrowser = typeof window !== "undefined" &&
    typeof localStorage !== "undefined" &&
    localStorage;
const speed_reader = (state = {
    wpm: (isBrowser && parseInt(localStorage.getItem("wpm"))) || 75,
    skin: (isBrowser && localStorage.getItem("skin")) || "blackonlight",
    words: [],
    cur: 0,
    started: false,
    open: false,
}, _a) => {
    var { type } = _a, props = __rest(_a, ["type"]);
    if (!isBrowser) {
        return state;
    }
    switch (type) {
        case "SPEED_READER_UPDATE":
            if (props.skin) {
                localStorage.setItem("skin", props.skin);
            }
            if (props.wpm) {
                localStorage.setItem("wpm", parseInt(props.wpm));
            }
            return Object.assign(Object.assign({}, state), props);
        default:
            return state;
    }
};
exports.speed_reader = speed_reader;
