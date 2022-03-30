"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveScheduleForCardId = exports.getScheduleFromUserData = void 0;
const deck_1 = require("app/vocabulary/actions/deck");
const userData_1 = require("app/vocabulary/actions/userData/userData");
// /**
//  * @param {UserData} user_data
//  * @returns {Object.<CardID, ScheduleData>}
//  */
const getScheduleFromUserData = (user_data) => {
    const schedule = {};
    Object.keys((user_data === null || user_data === void 0 ? void 0 : user_data.rows) || {}).forEach((key) => {
        if (user_data.rows[key].type === "schedule") {
            schedule[key] = user_data.rows[key].value;
        }
    });
    return schedule;
};
exports.getScheduleFromUserData = getScheduleFromUserData;
const saveScheduleForCardId = (card_id) => {
    (0, userData_1.setUserData)(card_id, deck_1.deck.schedule[card_id], "schedule");
};
exports.saveScheduleForCardId = saveScheduleForCardId;
