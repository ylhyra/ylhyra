"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessions = exports.SESSION_PREFIX = void 0;
const deck_1 = require("app/vocabulary/actions/deck");
exports.SESSION_PREFIX = "s_";
/**
 * @returns {Array}
 */
const getSessions = () => {
    var _a;
    const sessions = [];
    Object.keys(((_a = deck_1.deck === null || deck_1.deck === void 0 ? void 0 : deck_1.deck.user_data) === null || _a === void 0 ? void 0 : _a.rows) || {}).forEach((key) => {
        if (deck_1.deck.user_data.rows[key].type === "session") {
            sessions.push(deck_1.deck.user_data.rows[key].value);
        }
    });
    return sessions;
};
exports.getSessions = getSessions;
// export const getLastSessionTimestamp = () => {
//   let max = 0;
//   Object.keys(deck?.user_data?.rows || {}).forEach((key) => {
//     if (deck.user_data.rows[key].type === "session") {
//       sessions.push(deck.user_data.rows[key].value);
//     }
//   });
//   return sessions;
// };
