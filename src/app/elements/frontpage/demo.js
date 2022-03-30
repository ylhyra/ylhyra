"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.turnOffDemonstration = void 0;
const isDev_1 = require("app/app/functions/isDev");
const Reset_1 = __importDefault(require("documents/read/actions/Reset"));
const ShowWord_1 = __importDefault(require("documents/read/actions/ShowWord"));
/*
  Front page demo
*/
let on = true;
let ids = [];
let currentIndex = 0;
exports.default = () => {
    if (isDev_1.isDev)
        return;
    ids = [
        /* Spread in order to loop over node list */
        ...document.querySelectorAll("#frontpage-splash-screen-demo-text [data-word-has-definition]"),
    ].map(function (el) {
        return el.getAttribute("id");
    });
    next();
};
const next = () => {
    if (!on)
        return;
    (0, Reset_1.default)();
    (0, ShowWord_1.default)(ids[currentIndex]);
    currentIndex = (currentIndex + 1) % ids.length;
    setTimeout(next, 2400);
};
const turnOffDemonstration = () => {
    on = false;
};
exports.turnOffDemonstration = turnOffDemonstration;
