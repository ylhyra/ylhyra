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
Object.defineProperty(exports, "__esModule", { value: true });
const deck_1 = require("app/vocabulary/actions/deck");
const easinessLevel_1 = require("app/vocabulary/actions/easinessLevel");
const functions_1 = require("app/vocabulary/actions/easinessLevel/functions");
const constants_1 = require("app/vocabulary/constants");
const index_1 = require("tests/integrationTests/index");
const recipes_1 = require("tests/integrationTests/recipes");
exports.default = {
    "Easiness level correctly saved": () => __awaiter(void 0, void 0, void 0, function* () {
        yield recipes_1.run.vocabulary_session({
            values: [constants_1.EASY, constants_1.EASY, constants_1.EASY, constants_1.EASY, constants_1.EASY, constants_1.EASY, constants_1.EASY],
        });
        let e1 = (0, functions_1.getEasinessLevel)();
        yield recipes_1.run.signup_logout_login();
        (0, index_1.notNull)(e1);
        (0, index_1.shouldEqual)(e1, (0, functions_1.getEasinessLevel)());
    }),
    "Easiness level works": () => __awaiter(void 0, void 0, void 0, function* () {
        yield recipes_1.run.start_vocabulary_session({
            values: [constants_1.EASY, constants_1.EASY, constants_1.EASY, constants_1.EASY, constants_1.EASY, constants_1.EASY, constants_1.EASY],
        });
        (0, index_1.notNull)((0, functions_1.getEasinessLevel)());
        const checkIfCardsAreAboveEasinessLevel = () => {
            const cardsStillInSession = deck_1.deck.session.cards.filter((card) => !card.done &&
                (!card.hasBeenSeenInSession() || card.history.includes(constants_1.BAD)) &&
                card.getRanking() < 2000);
            (0, index_1.assert)(cardsStillInSession.length > 0 &&
                cardsStillInSession.every((i) => i.sortKey >= (0, functions_1.getEasinessLevel)()), `Expected easiness level to be below ${(0, functions_1.getEasinessLevel)()}, got:`, cardsStillInSession.map((i) => i.sortKey).sort((a, b) => a - b));
        };
        checkIfCardsAreAboveEasinessLevel();
        const v1 = deck_1.deck.session.currentCard.sortKey;
        yield recipes_1.run.continue_vocabulary_session({
            values: [constants_1.BAD, constants_1.GOOD],
        });
        (0, index_1.assert)((0, functions_1.getEasinessLevel)() <= v1 - easinessLevel_1.DEFAULT_JUMP_DOWN, "Easiness userLevel was not lowered");
        checkIfCardsAreAboveEasinessLevel();
    }),
};
