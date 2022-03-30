"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deck = void 0;
const isBrowser_1 = require("app/app/functions/isBrowser");
const localStorage_1 = require("app/app/functions/localStorage");
const updateURL_1 = require("app/router/actions/updateURL");
const functions_1 = require("app/vocabulary/actions/createCards/functions");
const functions_2 = require("app/vocabulary/actions/functions");
const session_1 = __importDefault(require("app/vocabulary/actions/session"));
// /**
//  * @property {Object.<string, Card>} cards
//  * @property {Array.<Card>} cards_sorted
//  * @property {Object.<string, Term>} terms
//  * @property {Object.<string, ScheduleData>} schedule
//  * @property {UserData} user_data
//  * @property {Session} session
//  */
class Deck {
    constructor({ database, schedule, session, user_data }) {
        exports.deck = this;
        this.cards = database.cards;
        this.terms = database.terms;
        this.user_data = user_data || {};
        this.schedule = schedule || {};
        this.cards_sorted = (0, functions_1.sortBySortKey)(Object.keys(this.cards), {
            englishLast: true,
        });
        this.termCount = (0, functions_2.countTerms)(exports.deck.cards_sorted);
        if (isBrowser_1.isBrowser) {
            window["deck"] = this;
        }
        this.session = new session_1.default(exports.deck, session);
    }
    continueStudying() {
        (0, updateURL_1.updateURL)("/vocabulary/play");
        this.session.reset();
        this.session.InitializeSession();
    }
    reset() {
        (0, localStorage_1.saveInLocalStorage)("vocabulary-user-data", null);
        (0, localStorage_1.saveInLocalStorage)("vocabulary-session", null);
        this.user_data = {};
        this.schedule = {};
    }
    /* Only used for testing */
    clear() {
        exports.deck = null;
    }
}
exports.default = Deck;
