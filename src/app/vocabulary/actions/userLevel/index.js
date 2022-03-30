"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printUserLevel = exports.getUserLevel = exports.setUserLevel = void 0;
const store_1 = __importDefault(require("app/app/store"));
const userData_1 = require("app/vocabulary/actions/userData/userData");
const constants_1 = require("app/vocabulary/constants");
const setUserLevel = (val) => {
    (0, userData_1.setUserData)("level", val);
    /* Currently only used to refresh the interface, does not store any data */
    store_1.default.dispatch({ type: "SET_USER_LEVEL", content: val });
};
exports.setUserLevel = setUserLevel;
const getUserLevel = () => {
    const val = (0, userData_1.getUserData)("level");
    return val ? parseInt(val) : null;
};
exports.getUserLevel = getUserLevel;
const printUserLevel = () => {
    switch ((0, exports.getUserLevel)()) {
        case constants_1.USER_LEVEL_BEGINNER:
            return "Beginner";
        case constants_1.USER_LEVEL_NOVICE:
            return "Novice";
        case constants_1.USER_LEVEL_INTERMEDIATE:
            return "Intermediate";
        case constants_1.USER_LEVEL_ADVANCED:
            return "Advanced";
        default:
            return "";
    }
};
exports.printUserLevel = printUserLevel;
