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
const deck_1 = require("app/vocabulary/actions/deck");
const functions_1 = require("app/vocabulary/actions/functions");
const index_1 = require("tests/integrationTests/index");
const underscore_1 = __importDefault(require("underscore"));
exports.default = {
    "Study particular ids": () => __awaiter(void 0, void 0, void 0, function* () {
        const card_ids = underscore_1.default.shuffle(Object.keys(deck_1.deck.cards)).slice(0, 4);
        yield (0, functions_1.studyParticularIds)(card_ids);
        (0, index_1.assert)(card_ids.every((card_id) => deck_1.deck.session.cards.some((card) => card_id === card.id)), `\nExpected session to include\n> ${card_ids
            .map(functions_1.printWord)
            .join(", ")}\nbut got \n> ${deck_1.deck.session.cards
            .map((c) => (0, functions_1.printWord)(c.id))
            .join(", ")}`);
    }),
};
