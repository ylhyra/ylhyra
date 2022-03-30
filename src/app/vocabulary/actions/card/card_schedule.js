"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNewTerm = exports.isNewCard = exports.wasTermSeenMoreRecentlyThan = exports.wasTermVeryRecentlySeen = exports.timeSinceTermWasSeen = exports.getTermLastSeen = exports.getLowestAvailableTermScore = exports.isUnseenTerm = exports.setSchedule = exports.isInSchedule = exports.isUnseenSiblingOfANonGoodCard = exports.isUnseenCard = exports.getLastSeen = exports.getLastIntervalInDays = exports.getNumberOfBadSessions = exports.getSessionsSeen = exports.getScore = exports.getDue = exports.getSchedule = void 0;
const math_1 = require("app/app/functions/math");
const time_1 = require("app/app/functions/time");
const card_data_1 = require("app/vocabulary/actions/card/card_data");
const card_siblings_1 = require("app/vocabulary/actions/card/card_siblings");
const term_1 = require("app/vocabulary/actions/card/term");
const deck_1 = require("app/vocabulary/actions/deck");
const userDataSchedule_1 = require("app/vocabulary/actions/userData/userDataSchedule");
const constants_1 = require("app/vocabulary/constants");
const getSchedule = (id) => {
    return deck_1.deck.schedule[id];
};
exports.getSchedule = getSchedule;
const getDue = (id) => {
    var _a;
    return (_a = (0, exports.getSchedule)(id)) === null || _a === void 0 ? void 0 : _a.due;
};
exports.getDue = getDue;
const getScore = (id) => {
    var _a;
    return (_a = (0, exports.getSchedule)(id)) === null || _a === void 0 ? void 0 : _a.score;
};
exports.getScore = getScore;
const getSessionsSeen = (id) => {
    var _a;
    return ((_a = (0, exports.getSchedule)(id)) === null || _a === void 0 ? void 0 : _a.sessions_seen) || 0;
};
exports.getSessionsSeen = getSessionsSeen;
const getNumberOfBadSessions = (id) => {
    var _a;
    return ((_a = (0, exports.getSchedule)(id)) === null || _a === void 0 ? void 0 : _a.number_of_bad_sessions) || 0;
};
exports.getNumberOfBadSessions = getNumberOfBadSessions;
const getLastIntervalInDays = (id) => {
    var _a;
    return (_a = (0, exports.getSchedule)(id)) === null || _a === void 0 ? void 0 : _a.last_interval_in_days;
};
exports.getLastIntervalInDays = getLastIntervalInDays;
const getLastSeen = (id) => {
    var _a;
    return (_a = (0, exports.getSchedule)(id)) === null || _a === void 0 ? void 0 : _a.last_seen;
};
exports.getLastSeen = getLastSeen;
const isUnseenCard = (id) => {
    return !(0, exports.getScore)(id);
};
exports.isUnseenCard = isUnseenCard;
const isUnseenSiblingOfANonGoodCard = (id) => {
    if (!(0, exports.isUnseenCard)(id))
        return false;
    const l = (0, exports.getLowestAvailableTermScore)(id);
    return l && l < constants_1.GOOD;
};
exports.isUnseenSiblingOfANonGoodCard = isUnseenSiblingOfANonGoodCard;
const isInSchedule = (id) => {
    return id in deck_1.deck.schedule;
};
exports.isInSchedule = isInSchedule;
const setSchedule = (id, data) => {
    /* Round timestamps */
    ["due", "last_seen", "last_bad_timestamp"].forEach((key) => {
        if (data[key]) {
            data[key] = (0, math_1.roundMsTo100Sec)(data[key]);
        }
    });
    deck_1.deck.schedule[id] = Object.assign(Object.assign({}, (deck_1.deck.schedule[id] || {})), data);
    (0, userDataSchedule_1.saveScheduleForCardId)(id);
};
exports.setSchedule = setSchedule;
const isUnseenTerm = (id) => {
    return !(0, exports.getTermLastSeen)(id);
};
exports.isUnseenTerm = isUnseenTerm;
const getLowestAvailableTermScore = (id) => {
    let lowest;
    (0, card_siblings_1.getAllCardIdsWithSameTerm)(id).forEach((card) => {
        if ((0, exports.getScore)(card)) {
            lowest = (0, math_1.minIgnoreFalsy)(lowest, (0, exports.getScore)(card));
        }
    });
    return lowest;
};
exports.getLowestAvailableTermScore = getLowestAvailableTermScore;
const getTermLastSeen = (id) => {
    // return memoize(id, "getTermLastSeen", () => {
    let max = 0;
    (0, card_siblings_1.getAllCardIdsWithSameTerm)(id).forEach((card) => {
        max = Math.max(max, (0, exports.getLastSeen)(card) || 0);
    });
    return max;
    // });
};
exports.getTermLastSeen = getTermLastSeen;
const timeSinceTermWasSeen = (id) => {
    let j = (0, exports.getTermLastSeen)(id);
    if (!j)
        return null;
    return (0, time_1.getTimeMemoized)() - j;
};
exports.timeSinceTermWasSeen = timeSinceTermWasSeen;
const wasTermVeryRecentlySeen = (id) => {
    return (0, exports.wasTermSeenMoreRecentlyThan)(id, 45 * time_1.minutes);
};
exports.wasTermVeryRecentlySeen = wasTermVeryRecentlySeen;
const wasTermSeenMoreRecentlyThan = (id, time) => {
    const i = (0, exports.timeSinceTermWasSeen)(id);
    return i && i < time;
};
exports.wasTermSeenMoreRecentlyThan = wasTermSeenMoreRecentlyThan;
const isNewCard = (id) => {
    return !(0, exports.isInSchedule)(id);
};
exports.isNewCard = isNewCard;
const isNewTerm = (id) => {
    // There exists at least one term
    return (0, card_data_1.getTermIds)(id).some((term) => 
    // Where every cardInSession is new
    (0, term_1.getCardIdsFromTermId)(term).every((id) => { var _a; return !(0, exports.isInSchedule)(id) && !((_a = (0, card_siblings_1.getAsCardInSession)(id)) === null || _a === void 0 ? void 0 : _a.hasBeenSeenInSession()); }));
};
exports.isNewTerm = isNewTerm;
