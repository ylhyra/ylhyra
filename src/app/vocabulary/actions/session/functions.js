"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.answer = exports.createMoreCards = exports.checkIfCardsRemaining = exports.getPercentageDone = exports.updateRemainingTime = void 0;
const log_1 = require("app/app/functions/log");
const time_1 = require("app/app/functions/time");
const session_1 = require("app/vocabulary/actions/session");
/**
 * @memberOf Session#
 */
function updateRemainingTime() {
    const diff = Math.min(session_1.MAX_SECONDS_TO_COUNT_PER_ITEM * 1000, (0, time_1.getTime)() - this.lastTimestamp);
    this.remainingTime = Math.max(0, this.remainingTime - diff);
    this.lastTimestamp = (0, time_1.getTime)();
    if (this.remainingTime <= 0) {
        this.sessionDone();
        this.done = true;
    }
}
exports.updateRemainingTime = updateRemainingTime;
/**
 * @memberOf Session#
 */
function getPercentageDone() {
    return ((this.totalTime - this.remainingTime) / this.totalTime) * 100;
}
exports.getPercentageDone = getPercentageDone;
/**
 * @memberOf Session#
 * @return {void}
 */
function checkIfCardsRemaining() {
    const areThereNewCardsRemaining = this.cards.some((i) => !i.hasBeenSeenInSession() && !i.done && i.canBeShown());
    if (!areThereNewCardsRemaining) {
        (0, log_1.log)("No cards remaining");
        this.createMoreCards();
    }
}
exports.checkIfCardsRemaining = checkIfCardsRemaining;
/**
 * @memberOf Session#
 */
function createMoreCards() {
    this.createCards();
    (0, log_1.log)("New cards generated");
}
exports.createMoreCards = createMoreCards;
/**
 * @memberOf Session#
 * @param {number} rating
 */
function answer(rating) {
    var _a;
    const session = this;
    (_a = session.currentCard) === null || _a === void 0 ? void 0 : _a.rate(rating);
    session.nextCard();
    if (!session.done) {
        session.loadCardInInterface();
    }
}
exports.answer = answer;
