"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isDev_1 = require("app/app/functions/isDev");
const time_1 = require("app/app/functions/time");
const card_1 = require("app/vocabulary/actions/card/card");
const card_difficulty_1 = require("app/vocabulary/actions/card/card_difficulty");
const card_schedule_1 = require("app/vocabulary/actions/card/card_schedule");
const dependencies_1 = require("app/vocabulary/actions/functions/dependencies");
/* Add bad dependencies */
exports.default = (chosen_cards) => {
    const after = (0, dependencies_1.withDependencies)(chosen_cards, { skipSiblings: true }).filter((id) => !(0, card_1.isInSession)(id) &&
        /* Keep in those already chosen */
        ((0, card_1.isIn)(id, chosen_cards) ||
            ((0, card_difficulty_1.isBad)(id) && (0, card_schedule_1.wasTermSeenMoreRecentlyThan)(id, 45 * time_1.minutes)) ||
            ((0, card_difficulty_1.isFairlyBad)(id) && (0, card_schedule_1.wasTermSeenMoreRecentlyThan)(id, 2 * time_1.days))));
    if (isDev_1.isDev) {
        // if (after.length !== chosen_cards.length) {
        //   log(
        //     `Dependencies added, before:\n${chosen_cards
        //       .map((card) => card.printWord())
        //       .join(", ")}\nafter:\n${after
        //       .map((card) =>
        //         card.isIn(chosen_cards)
        //           ? card.printWord()
        //           : "<<<" + card.printWord() + ">>>"
        //       )
        //       .join(", ")}`
        //   );
        // }
    }
    return after;
};
