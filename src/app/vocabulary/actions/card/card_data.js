"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSortKey = exports.getTermIds = exports.getSound = exports.getDifficulty = exports.getImportance = exports.getCardCEFR = exports.getCardLevel = exports.getLevel = exports.getId = exports.getFrom = exports.getData = exports.getCardsInSchedule = void 0;
const card_1 = require("app/vocabulary/actions/card/card");
const term_1 = require("app/vocabulary/actions/card/term");
const deck_1 = require("app/vocabulary/actions/deck");
const getCardsInSchedule = () => {
    return (0, card_1.filterCardsThatExist)(Object.keys(deck_1.deck.schedule));
};
exports.getCardsInSchedule = getCardsInSchedule;
const getData = (id, key) => {
    if (!(id in deck_1.deck.cards)) {
        console.error(`Card not found:`, id);
        throw new Error();
    }
    if (key in deck_1.deck.cards[id]) {
        return deck_1.deck.cards[id][key];
    }
    else if (key === "terms") {
        return [id.slice(0, -3)];
    }
    else if ((0, exports.getTermIds)(id).length === 1) {
        return (0, term_1.getTermData)((0, exports.getTermIds)(id)[0])[key];
    }
    else {
        return null;
    }
};
exports.getData = getData;
const getFrom = (id) => {
    return id.slice(-2);
};
exports.getFrom = getFrom;
const getId = (id) => {
    return (0, exports.getData)(id, "id");
};
exports.getId = getId;
const getLevel = (id) => {
    return (0, exports.getData)(id, "level");
};
exports.getLevel = getLevel;
exports.getCardLevel = exports.getLevel;
exports.getCardCEFR = exports.getLevel;
const getImportance = (id) => {
    return (0, exports.getData)(id, "importance");
};
exports.getImportance = getImportance;
const getDifficulty = (id) => {
    return (0, exports.getData)(id, "difficulty");
};
exports.getDifficulty = getDifficulty;
const getSound = (id) => {
    return (0, exports.getData)(id, "sound");
};
exports.getSound = getSound;
const getTermIds = (id) => {
    return (0, exports.getData)(id, "terms");
};
exports.getTermIds = getTermIds;
const getSortKey = (id, options) => {
    if (options === null || options === void 0 ? void 0 : options.englishLast) {
        return (0, exports.getData)(id, "sortKey") + (0, exports.getFrom)(id) === "en" ? 0.5 : 0;
    }
    else {
        return (0, exports.getData)(id, "sortKey");
    }
};
exports.getSortKey = getSortKey;
