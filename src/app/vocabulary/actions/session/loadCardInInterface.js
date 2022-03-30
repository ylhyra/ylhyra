"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCardInInterface = void 0;
const store_1 = __importDefault(require("app/app/store"));
/**
 * @memberOf Session#
 */
function loadCardInInterface() {
    const session = this;
    if (!(session === null || session === void 0 ? void 0 : session.currentCard))
        return console.error("no cards");
    store_1.default.dispatch({
        type: "NEW_CARD_IN_INTERFACE",
        content: session.counter,
    });
    // // Debug: Show dependencies
    // if (isDev) {
    //   log(
    //     getTermsFromCards(
    //       Object.keys(session.currentCard.dependenciesAndSameTerm)
    //     ).map(printWord)
    //   );
    // }
    // // Debug: Show score
    // if (
    //   this.deck.schedule[session.currentCard.id] &&
    //   isDev
    // ) {
    //   log(
    //     `Score of "${printWord(session.currentCard.id)}": ${
    //       this.deck.schedule[session.currentCard.id].score
    //     } - last interval: ${
    //       this.deck.schedule[session.currentCard.id].last_interval_in_days
    //     }`
    //   );
    // }
}
exports.loadCardInInterface = loadCardInInterface;
