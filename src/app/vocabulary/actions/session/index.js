"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_SECONDS_TO_COUNT_PER_ITEM = void 0;
const analytics_1 = __importDefault(require("app/app/analytics"));
const constants_1 = require("app/app/constants");
const localStorage_1 = require("app/app/functions/localStorage");
const log_1 = require("app/app/functions/log");
const math_1 = require("app/app/functions/math");
const time_1 = require("app/app/functions/time");
const card_1 = require("app/vocabulary/actions/card/card");
const cardInSession_1 = __importDefault(require("app/vocabulary/actions/cardInSession"));
const createCards_1 = require("app/vocabulary/actions/createCards");
const createSchedule_1 = require("app/vocabulary/actions/createSchedule");
const functions_1 = require("app/vocabulary/actions/functions");
const functions_2 = require("app/vocabulary/actions/session/functions");
const initialize_1 = require("app/vocabulary/actions/session/initialize");
const loadCardInInterface_1 = require("app/vocabulary/actions/session/loadCardInInterface");
const loadCardsIntoSession_1 = require("app/vocabulary/actions/session/loadCardsIntoSession");
const nextCard_1 = require("app/vocabulary/actions/session/nextCard");
const undo_1 = require("app/vocabulary/actions/session/undo");
const sync_1 = require("app/vocabulary/actions/userData/sync");
const userData_1 = require("app/vocabulary/actions/userData/userData");
const userDataSessions_1 = require("app/vocabulary/actions/userData/userDataSessions");
const actions_1 = require("app/vocabulary/elements/OverviewScreen/actions");
exports.MAX_SECONDS_TO_COUNT_PER_ITEM = 10;
class Session {
    constructor(deck, init) {
        this.undo = undo_1.undo;
        this.undoable = undo_1.undoable;
        this.checkForUndoOnKeyDown = undo_1.checkForUndoOnKeyDown;
        this.createCards = createCards_1.createCards;
        this.InitializeSession = initialize_1.InitializeSession;
        this.nextCard = nextCard_1.nextCard;
        this.createSchedule = createSchedule_1.createSchedule;
        this.loadCardsIntoSession = loadCardsIntoSession_1.loadCardsIntoSession;
        this.loadCardInInterface = loadCardInInterface_1.loadCardInInterface;
        this.updateRemainingTime = functions_2.updateRemainingTime;
        this.getPercentageDone = functions_2.getPercentageDone;
        this.checkIfCardsRemaining = functions_2.checkIfCardsRemaining;
        this.createMoreCards = functions_2.createMoreCards;
        this.answer = functions_2.answer;
        this.reset();
        this.deck = deck;
        /* Used to save the progress of a session that was prematurely closed */
        if (init === null || init === void 0 ? void 0 : init.cards) {
            Object.assign(this, init);
            this.cards = this.cards
                .map(({ id, history }) => {
                if ((0, card_1.doesCardExist)(id)) {
                    return new cardInSession_1.default({
                        id,
                        history,
                    });
                }
                else {
                    console.warn("No id " + id);
                    return null;
                }
            })
                .filter(Boolean);
            /* TODO:
              Þetta virkar ekki án timeout þar sem Deck.session er ekki búið að initializeras fyrst
             */
            setTimeout(() => {
                this.sessionDone({ isInitializing: true });
            }, 10);
        }
        // log({ session_log: this.deck.session_log });
    }
    reset() {
        this.allowed_ids = null;
        this.ratingHistory = [];
        this.cardHistory = [];
        this.counter = 0;
        this.lastSeenTerms = {};
        this.cardTypeLog = [];
        this.currentCard = null;
        this.cards = [];
        this.timeStarted = (0, time_1.getTime)();
        this.totalTime = (constants_1.EACH_SESSION_LASTS_X_MINUTES * time_1.minutes);
        this.remainingTime = this.totalTime;
        this.lastTimestamp = (0, time_1.getTime)();
        this.done = false;
        this.lastUndid = 0;
        this.savedAt = null;
    }
    sessionDone(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this.done = true;
            yield this.createSchedule();
            this.clearInLocalStorage();
            if (!options.isInitializing) {
                yield (0, functions_1.exitVocabularyScreen)();
            }
            this.saveSessionLog();
            yield (0, sync_1.sync)();
            yield (0, actions_1.clearOverview)();
            this.reset();
        });
    }
    getSecondsSpent() {
        return Math.round((this.totalTime - Math.max(0, this.remainingTime)) / 1000);
    }
    saveSessionInLocalStorage() {
        const session = this;
        if (!session.cards.some((i) => i.hasBeenSeenInSession())) {
            return;
        }
        let to_save = session.cards.map((card) => ({
            id: card.getId(),
            history: card.history,
        }));
        (0, localStorage_1.saveInLocalStorage)("vocabulary-session", {
            remainingTime: this.remainingTime,
            savedAt: (0, time_1.getTime)(),
            cards: to_save,
        });
        this.savedAt = (0, time_1.getTime)();
    }
    clearInLocalStorage() {
        (0, localStorage_1.saveInLocalStorage)("vocabulary-session", null);
    }
    saveSessionLog() {
        if (this.cardHistory.length > 0 && this.getSecondsSpent() > 10) {
            const timestamp = (0, math_1.roundMsToSec)(this.savedAt || (0, time_1.getTime)());
            const timestamp_in_seconds = Math.round(timestamp / 1000);
            (0, userData_1.setUserData)(userDataSessions_1.SESSION_PREFIX + timestamp_in_seconds, {
                seconds_spent: (0, math_1.roundToInterval)(this.getSecondsSpent(), 10),
                timestamp,
            }, "session");
            // TODO: Ignore logged in users?
            analytics_1.default.log({
                type: "vocabulary",
                page_name: window.location.pathname,
                seconds: (0, math_1.roundToInterval)(this.getSecondsSpent(), 10),
                timestamp,
            });
        }
        else {
            (0, log_1.log)("Not logged");
        }
    }
}
exports.default = Session;
