"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("app/vocabulary/actions/card/card");
const card_schedule_1 = require("app/vocabulary/actions/card/card_schedule");
const functions_1 = require("app/vocabulary/actions/createCards/functions");
const deck_1 = require("app/vocabulary/actions/deck");
const functions_2 = require("app/vocabulary/actions/easinessLevel/functions");
const underscore_1 = require("underscore");
exports.default = (options) => {
    let new_cards = deck_1.deck.cards_sorted.filter((card) => !(0, card_schedule_1.isInSchedule)(card) && (0, card_1.isAllowed)(card));
    if (deck_1.deck.session.allowed_ids && !(options === null || options === void 0 ? void 0 : options.dont_sort_by_allowed_ids)) {
        /* Sort in same order as allowed_ids */
        new_cards = (0, underscore_1.sortBy)(new_cards, (i) => deck_1.deck.session.allowed_ids.indexOf(i.getId()));
    }
    else if ((0, functions_2.isEasinessLevelOn)()) {
        new_cards = (0, underscore_1.sortBy)(new_cards, (i) => i.getSortKeyAdjustedForEasinessLevel());
    }
    else if (options === null || options === void 0 ? void 0 : options.skipOverTheEasiest) {
        // todo!!!
        // /*
        //   If we are unable to create cards with a given allowed_ids,
        //   the user does not want to see "Hæ", so we skip over the beginning.
        // */
        // const lowest = clamp(getLowestBadCardSortKey() || Infinity, 50, 300);
        // new_cards = sortBy(new_cards, (i) => i.getSortKeyAdjusted(lowest));
    }
    return (0, functions_1.veryRecentlySeenSortedLast)(new_cards.slice(0, 200));
};
