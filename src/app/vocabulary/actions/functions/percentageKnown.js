"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PercentageKnownOverall = exports.PercentageKnown = void 0;
const math_1 = require("app/app/functions/math");
const card_schedule_1 = require("app/vocabulary/actions/card/card_schedule");
const deck_1 = require("app/vocabulary/actions/deck");
const PercentageKnown = (card_ids) => {
    if (!(deck_1.deck === null || deck_1.deck === void 0 ? void 0 : deck_1.deck.schedule))
        return 0;
    let done = 0;
    let remaining = 0;
    card_ids.forEach((id) => {
        if ((0, card_schedule_1.isInSchedule)(id)) {
            let score = (0, card_schedule_1.getScore)(id) || 2;
            let toAdd;
            if (score < 1.9) {
                toAdd = (0, math_1.mapValueToRange)({
                    value: (0, math_1.clamp)((0, card_schedule_1.getSessionsSeen)(id), 0, 10) +
                        (0, math_1.clamp)(((0, card_schedule_1.getSessionsSeen)(id) - 10) / 3, 0, 10),
                    input_from: 0,
                    input_to: 20,
                    output_from: 0.1,
                    output_to: 0.85,
                    clamp: true,
                });
            }
            else {
                toAdd = 1;
            }
            done += toAdd;
            remaining += 1 - toAdd;
        }
        else {
            remaining++;
        }
    });
    const ratio = done / (remaining + done) || 0;
    if (ratio === 0)
        return 0;
    let percentage;
    if (card_ids.length < 200) {
        percentage = Math.ceil(ratio * 100);
        if (percentage === 100 && done !== remaining)
            percentage = 99;
    }
    else {
        percentage = (ratio * 100).toFixed(2);
    }
    return percentage;
};
exports.PercentageKnown = PercentageKnown;
const PercentageKnownOverall = () => {
    if (!deck_1.deck)
        return 0;
    return (0, exports.PercentageKnown)(Object.keys(deck_1.deck.cards));
};
exports.PercentageKnownOverall = PercentageKnownOverall;
// if (isBrowser) {
//   window.PercentageKnownOverall = PercentageKnownOverall;
// }
