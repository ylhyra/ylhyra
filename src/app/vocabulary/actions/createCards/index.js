"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCards = exports.CARDS_TO_CREATE = void 0;
const log_1 = require("app/app/functions/log");
const warnIfSlow_1 = require("app/app/functions/warnIfSlow");
const card_1 = require("app/vocabulary/actions/card/card");
const functions_1 = require("app/vocabulary/actions/card/functions");
const _3_Choose_cards_1 = __importDefault(require("app/vocabulary/actions/createCards/3_Choose_cards"));
const _4_Dependencies_1 = __importDefault(require("app/vocabulary/actions/createCards/4_Dependencies"));
exports.CARDS_TO_CREATE = 50;
/**
 * @memberOf Session#
 */
function createCards(options) {
    warnIfSlow_1.warnIfSlow.start("createCards");
    (0, functions_1.rememoizeCards)();
    const session = this;
    /* If all allowed_ids are already in use, clear it */
    if (session.allowed_ids &&
        ((0, card_1.filterCardsThatExist)(session.allowed_ids).length === 0 ||
            (0, card_1.filterCardsThatExist)(session.allowed_ids).every((id) => (0, card_1.isInSession)(id)))) {
        session.allowed_ids = null;
        (0, log_1.logDev)("allowed_ids cleared");
    }
    /* Create cards */
    let chosen_cards = (0, _3_Choose_cards_1.default)(options);
    /* Add dependencies */
    if (!(options === null || options === void 0 ? void 0 : options.skip_dependencies)) {
        chosen_cards = (0, _4_Dependencies_1.default)(chosen_cards);
    }
    /* Failed to generate cards, turn off allowed cards and try again */
    if (chosen_cards.length === 0 && session.allowed_ids) {
        console.warn(`Failed to generate more cards using the allowed ones, switching to all cards.`);
        session.allowed_ids = null;
        return this.createCards({ skipOverTheEasiest: true });
    }
    warnIfSlow_1.warnIfSlow.end("createCards");
    this.loadCardsIntoSession(chosen_cards, options);
}
exports.createCards = createCards;
