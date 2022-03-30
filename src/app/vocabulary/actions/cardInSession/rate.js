"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rate = void 0;
const card_data_1 = require("app/vocabulary/actions/card/card_data");
const card_difficulty_1 = require("app/vocabulary/actions/card/card_difficulty");
const card_schedule_1 = require("app/vocabulary/actions/card/card_schedule");
const addRelatedCardsToSession_1 = require("app/vocabulary/actions/cardInSession/addRelatedCardsToSession");
const easinessLevel_1 = require("app/vocabulary/actions/easinessLevel");
const constants_1 = require("app/vocabulary/constants");
/**
 * @memberOf CardInSession#
 */
function rate(rating) {
    const card = this;
    const id = card.getId();
    const timesSeenBeforeInSession = card.history.length;
    card.history.unshift(rating);
    card.session.ratingHistory.unshift(rating);
    card.session.cardHistory.unshift(card);
    card.lastSeen = card.session.counter;
    const lastRating = card.history[1];
    const nextLastRating = card.history[2];
    let interval;
    if (rating === constants_1.BAD) {
        interval = (0, card_schedule_1.getSessionsSeen)(id) > 0 ? 4 : 3;
        /* Two bad ratings in a row */
        if (lastRating === constants_1.BAD) {
            interval = 3;
            // Three bad ratings in a row always get an interval of 2
            if (nextLastRating === constants_1.BAD) {
                interval = 2;
            }
            // But two bad ratings in a row also occasionally get an interval of 2
            else if (Math.random() < 0.2) {
                interval = 2;
            }
        }
        /* User is getting annoyed */
        if (timesSeenBeforeInSession >= 6 && timesSeenBeforeInSession % 2 === 0) {
            interval = 8;
        }
        card.done = false;
    }
    else if (rating === constants_1.GOOD) {
        interval = 200;
        card.done = true;
        if (lastRating === constants_1.BAD) {
            interval = 5;
            card.done = false;
        }
        else if (nextLastRating === constants_1.BAD) {
            interval = 10;
        }
        else if ((0, card_difficulty_1.isBad)(id) && timesSeenBeforeInSession === 0) {
            interval = 12;
        }
    }
    else if (rating === constants_1.EASY) {
        interval = 800;
        card.done = true;
    }
    if (rating === constants_1.BAD) {
        (0, addRelatedCardsToSession_1.addRelatedCardsToSession)(card);
    }
    card.showIn({ interval });
    card.postponeRelatedCards(interval);
    card.session.cardTypeLog.unshift((0, card_data_1.getFrom)(id));
    (0, easinessLevel_1.keepTrackOfEasiness)({
        rating,
        isANewCard: !(0, card_schedule_1.isInSchedule)(id) && timesSeenBeforeInSession === 0,
        card,
    });
}
exports.rate = rate;
