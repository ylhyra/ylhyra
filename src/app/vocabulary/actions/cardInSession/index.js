"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getRanking_1 = require("app/vocabulary/actions/cardInSession/getRanking");
const postponeRelatedCards_1 = require("app/vocabulary/actions/cardInSession/postponeRelatedCards");
const rate_1 = require("app/vocabulary/actions/cardInSession/rate");
const showIn_1 = require("app/vocabulary/actions/cardInSession/showIn");
class CardInSession {
    constructor({ id, insertAtPosition, session, history, }) {
        this.getRanking = getRanking_1.getRanking;
        this.rate = rate_1.rate;
        this.postponeRelatedCards = postponeRelatedCards_1.postponeRelatedCards;
        this.showIn = showIn_1.showIn;
        this.canBeShown = showIn_1.canBeShown;
        this.id = id;
        this.session = session;
        this.history = history || [];
        this.absoluteQueuePosition =
            ((session === null || session === void 0 ? void 0 : session.counter) || 0) + (insertAtPosition || 0);
    }
    getId() {
        return this.id;
    }
    hasBeenSeenInSession() {
        return this.history.length > 0;
    }
    getOtherCardsInSession() {
        return this.session.cards.filter((card) => card.getId() !== this.getId());
    }
    getQueuePosition() {
        return this.absoluteQueuePosition - this.session.counter;
    }
    setQueuePosition(interval) {
        this.absoluteQueuePosition = this.session.counter + interval;
    }
    setCannotBeShownBefore(interval) {
        this.cannotBeShownBefore = Math.max(this.cannotBeShownBefore || 0, this.session.counter + interval);
    }
}
exports.default = CardInSession;
