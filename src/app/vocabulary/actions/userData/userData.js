"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUserDataInLocalStorage = exports.setUserData = exports.getUserData = void 0;
const isBrowser_1 = require("app/app/functions/isBrowser");
const localStorage_1 = require("app/app/functions/localStorage");
const time_1 = require("app/app/functions/time");
const deck_1 = require("app/vocabulary/actions/deck");
// /**
//  * @typedef {Object} UserData
//  * @property {string} user_id
//  * @property {Timestamp} lastSynced
//  * @property {UserDataRows} rows
//  */
// /**
//  * @typedef {Object.<string, {
//  *   value: string,
//  *   needsSyncing: boolean,
//  *   type: ("schedule"|null)
//  * }>|Object} UserDataRows
//  */
/**
 * In other words, user data is stored on: {
 *   user_id,
 *   lastSynced,
 *   rows: {
 *     [key]: {
 *       value,
 *       needsSyncing,
 *     }
 *   }
 * }
 */
const getUserData = (key) => {
    var _a, _b, _c;
    return ((_c = (_b = (_a = deck_1.deck === null || deck_1.deck === void 0 ? void 0 : deck_1.deck.user_data) === null || _a === void 0 ? void 0 : _a.rows) === null || _b === void 0 ? void 0 : _b[key]) === null || _c === void 0 ? void 0 : _c.value) || null;
};
exports.getUserData = getUserData;
const setUserData = (key, value, type) => {
    if (key.length > 20) {
        throw new Error("Max key length is 20");
    }
    if (!("rows" in deck_1.deck.user_data)) {
        // console.log(`deck.user_data didn't have rows`);
        deck_1.deck.user_data.rows = {};
    }
    deck_1.deck.user_data.rows[key] = {
        value,
        needsSyncing: (0, time_1.getTime)(),
        type,
    };
    (0, exports.saveUserDataInLocalStorage)();
};
exports.setUserData = setUserData;
let timer;
const saveUserDataInLocalStorage = (user_data = {}, options = {}) => {
    const toSave = Object.assign(Object.assign(Object.assign({}, ((deck_1.deck === null || deck_1.deck === void 0 ? void 0 : deck_1.deck.user_data) || {})), user_data), { lastSaved: (0, time_1.getTime)() });
    if (deck_1.deck && options.assignToDeck) {
        if (!toSave.rows) {
            console.warn({ toSave, user_data_input: user_data });
            throw new Error(`saveUserDataInLocalStorage didn't receive rows`);
        }
        deck_1.deck.user_data = toSave;
    }
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
        (0, localStorage_1.saveInLocalStorage)("vocabulary-user-data", toSave);
    }, 1000);
};
exports.saveUserDataInLocalStorage = saveUserDataInLocalStorage;
if (isBrowser_1.isBrowser) {
    window["getUserData"] = exports.getUserData;
}
