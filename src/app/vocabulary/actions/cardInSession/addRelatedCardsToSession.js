"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRelatedCardsToSession = void 0;
const log_1 = require("app/app/functions/log");
const time_1 = require("app/app/functions/time");
const card_1 = require("app/vocabulary/actions/card/card");
const card_dependencies_1 = require("app/vocabulary/actions/card/card_dependencies");
const card_difficulty_1 = require("app/vocabulary/actions/card/card_difficulty");
const card_schedule_1 = require("app/vocabulary/actions/card/card_schedule");
const functions_1 = require("app/vocabulary/actions/functions");
/**
 * If a cardInSession gets a bad rating, then we make sure
 * to add very related cards to the session.
 */
const addRelatedCardsToSession = (card) => {
    const id = card.getId();
    let to_add = [];
    /* Bail for repeated failures ... */
    if (card.history.length > 1)
        return;
    (0, card_dependencies_1.getDependenciesAsArrayOfCardIds)(card.getId()).forEach((related_card_id) => {
        /* Ignore cards already in session */
        if ((0, card_1.isInSession)(related_card_id))
            return;
        /* Add cards with the same term */
        if ((0, card_dependencies_1.dependencyDepthOfCard)(id, related_card_id) === 0) {
            return to_add.push(related_card_id);
        }
        /* Ignore cyclical dependencies */
        if ((0, card_dependencies_1.dependencyDepthOfCard)(related_card_id, id) > 0)
            return;
        if ((0, card_schedule_1.wasTermVeryRecentlySeen)(related_card_id))
            return;
        /* Add cards that this term directly depends on */
        if ((0, card_dependencies_1.dependencyDepthOfCard)(id, related_card_id) === 1 &&
            /* Unseen or unknown cards */
            ((0, card_schedule_1.isUnseenTerm)(related_card_id) ||
                (0, card_difficulty_1.isBad)(related_card_id) ||
                ((0, card_difficulty_1.isFairlyBad)(related_card_id) &&
                    (0, card_schedule_1.timeSinceTermWasSeen)(related_card_id) > 5 * time_1.days &&
                    Math.random() > 0.7))) {
            (0, log_1.log)(`Direct dependency "${(0, functions_1.printWord)(related_card_id)}" added`);
            to_add.push(related_card_id);
        }
    });
    card.session.loadCardsIntoSession(to_add, {
        insertImmediately: true,
    });
};
exports.addRelatedCardsToSession = addRelatedCardsToSession;
