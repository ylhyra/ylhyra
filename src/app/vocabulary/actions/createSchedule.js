"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchedule = exports.INCR = void 0;
const log_1 = require("app/app/functions/log");
const math_1 = require("app/app/functions/math");
const time_1 = require("app/app/functions/time");
const card_1 = require("app/vocabulary/actions/card/card");
const card_schedule_1 = require("app/vocabulary/actions/card/card_schedule");
const card_siblings_1 = require("app/vocabulary/actions/card/card_siblings");
const constants_1 = require("app/vocabulary/constants");
const functions_1 = require("./functions");
/** Increment score by how much? */
exports.INCR = 0.4;
const EASY_MULTIPLIER = 7;
const GOOD_MULTIPLIER = 2.5;
const BAD_INITIAL_INTERVAL = 1.3;
const GOOD_INITIAL_INTERVAL = 5;
/**
 * Long-term scheduling
 * @memberOf Session#
 */
function createSchedule() {
    var _a;
    const session = this;
    if (!session) {
        console.error("createSchedule called without an active session!");
        return;
    }
    if (!((_a = session.cards) === null || _a === void 0 ? void 0 : _a.some((i) => i.hasBeenSeenInSession())))
        return;
    session.cards.forEach((card) => {
        let due_in_days;
        const id = card.getId();
        const prevScore = (0, card_schedule_1.getScore)(id);
        const sessions_seen = (0, card_schedule_1.getSessionsSeen)(id);
        const isNew = !prevScore;
        const sessionHistory = card.history;
        if (sessionHistory.length === 0)
            return;
        const avgRating = (0, math_1.average)(sessionHistory);
        const last_interval_in_days = (0, card_schedule_1.getLastIntervalInDays)(id);
        const last_seen = (0, card_schedule_1.getLastSeen)(id);
        const badCount = sessionHistory.filter((i) => i === constants_1.BAD).length;
        const anyBad = badCount > 0;
        let score = prevScore || avgRating;
        /* SCORE */
        if (isNew) {
            if (anyBad) {
                score = constants_1.BAD;
            }
            else {
                score = avgRating; //- 0.05;
            }
        }
        else {
            if (anyBad) {
                score = constants_1.BAD;
            }
            else {
                score = (0, math_1.clamp)(score + exports.INCR, constants_1.BAD, constants_1.EASY + 1);
            }
        }
        /* SCHEDULE */
        if (anyBad) {
            due_in_days = BAD_INITIAL_INTERVAL;
        }
        else if (isNew) {
            if (avgRating === constants_1.EASY) {
                due_in_days = 40;
            }
            else if (avgRating === constants_1.GOOD) {
                due_in_days = GOOD_INITIAL_INTERVAL;
            }
        }
        else {
            const multiplier = avgRating === constants_1.EASY ? EASY_MULTIPLIER : GOOD_MULTIPLIER;
            due_in_days = (last_interval_in_days || 1) * multiplier;
            /*
              If we showed the item far in advance of the scheduled due date,
              then we give the user the same interval as last time
            */
            const actual_interval_in_days = (0, time_1.msToDays)((0, time_1.getTime)() - last_seen);
            if (actual_interval_in_days / last_interval_in_days < 0.3) {
                const new_due_in_days = last_interval_in_days;
                (0, log_1.log)(`${(0, functions_1.printWord)(card)} - given ${new_due_in_days} instead of ${due_in_days}`);
                due_in_days = new_due_in_days;
            }
        }
        /**
         * If any sibling cards got a bad rating in this session,
         * this card can not be given a good score
         */
        if (score >= constants_1.GOOD && (0, card_siblings_1.didAnySiblingCardsGetABadRatingInThisSession)(id)) {
            due_in_days = Math.min(2, due_in_days);
            score = Math.min(constants_1.BAD + exports.INCR, score);
            (0, log_1.log)(`${(0, functions_1.printWord)(id)} given a low score due to siblings having gotten a bad rating`);
        }
        (0, card_schedule_1.setSchedule)(card, Object.assign({ due: (0, time_1.daysFromNowToTimestamp)((0, math_1.addSomeRandomness)(due_in_days)), last_interval_in_days: (0, math_1.toFixedFloat)(due_in_days, 1), score: (0, math_1.toFixedFloat)(score, 2), last_seen: (0, time_1.getTime)(), sessions_seen: sessions_seen + 1 }, (anyBad
            ? {
                last_bad_timestamp: (0, time_1.getTime)(),
                number_of_bad_sessions: (0, card_schedule_1.getNumberOfBadSessions)(card.getId()) + 1,
            }
            : {})));
        (0, log_1.log)((0, functions_1.printWord)(id), `score: ${(0, math_1.toFixedFloat)(score, 2)}`, `days: ${(0, math_1.toFixedFloat)(due_in_days, 1)}`);
        /* Postpone siblings */
        (0, card_siblings_1.getSiblingCards)(id)
            /* Ignore cards that were seen in this session */
            .filter((sibling_card) => !(0, card_1.wasSeenInSession)(sibling_card))
            .forEach((sibling_card) => {
            /* Postpone based on a portion of the main card's due_in_days,
               but never more than 10 days */
            const newDue = (0, time_1.daysFromNowToTimestamp)(Math.min(due_in_days * 0.8, 10));
            const actualDue = (0, card_schedule_1.getDue)(sibling_card);
            if (!actualDue || actualDue < newDue) {
                (0, card_schedule_1.setSchedule)(sibling_card, {
                    due: newDue,
                });
                (0, log_1.log)(`${(0, functions_1.printWord)(sibling_card)} postponed`);
            }
        });
    });
    (0, log_1.log)("Schedule made");
}
exports.createSchedule = createSchedule;
