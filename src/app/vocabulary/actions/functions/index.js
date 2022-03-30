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
exports.exitVocabularyScreen = exports.countTermsInSchedule = exports.rapidFlattenArrayAndCountUnique = exports.rapidCountUnique = exports.countTerms = exports.studyNewTerms = exports.studyParticularIds = exports.printWord = void 0;
const isBrowser_1 = require("app/app/functions/isBrowser");
const isDev_1 = require("app/app/functions/isDev");
const log_1 = require("app/app/functions/log");
const math_1 = require("app/app/functions/math");
const updateURL_1 = require("app/router/actions/updateURL");
const card_data_1 = require("app/vocabulary/actions/card/card_data");
const card_schedule_1 = require("app/vocabulary/actions/card/card_schedule");
const functions_1 = require("app/vocabulary/actions/card/functions");
const deck_1 = require("app/vocabulary/actions/deck");
const format_1 = require("maker/vocabulary_maker/compile/format");
const functions_2 = require("maker/vocabulary_maker/compile/functions");
const printWord = (id) => {
    if (!isDev_1.isDev)
        return;
    if (id in deck_1.deck.cards) {
        return (0, format_1.getPlaintextFromFormatted)((0, card_data_1.getData)(id, (0, card_data_1.getFrom)(id) + "_formatted"));
        // return card[card.getFrom() + "_plaintext"];
    }
    else if (id in deck_1.deck.terms) {
        return (0, exports.printWord)(deck_1.deck.terms[id].cards[0]);
    }
    else {
        (0, log_1.log)(`No id ${id}`);
    }
};
exports.printWord = printWord;
const studyParticularIds = (allowed_ids, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { session } = deck_1.deck;
    session.reset();
    session.allowed_ids = allowed_ids;
    session.createCards(options);
    yield session.InitializeSession({ shouldReset: false });
    (0, updateURL_1.updateURL)("/vocabulary/play");
});
exports.studyParticularIds = studyParticularIds;
const studyNewTerms = () => {
    const newTerms = [];
    Object.keys(deck_1.deck.cards).forEach((id) => {
        if (!(id in deck_1.deck.schedule) && (0, card_schedule_1.isNewTerm)(id)) {
            newTerms.push(id);
        }
    });
    (0, exports.studyParticularIds)(newTerms, {
        skip_dependencies: true,
        dont_sort_by_allowed_ids: true,
    });
};
exports.studyNewTerms = studyNewTerms;
const countTerms = (ids) => {
    const i = (0, exports.rapidFlattenArrayAndCountUnique)(ids.map((id) => (0, card_data_1.getTermIds)(id)));
    return (0, math_1.roundToInterval)(i, i > 200 ? 50 : 5);
};
exports.countTerms = countTerms;
const rapidCountUnique = (i) => new Set(i).size;
exports.rapidCountUnique = rapidCountUnique;
const rapidFlattenArrayAndCountUnique = (arrOfArrs) => {
    let s = new Set();
    arrOfArrs.forEach((arr) => {
        arr.forEach((i) => {
            s.add(i);
        });
    });
    return s.size;
};
exports.rapidFlattenArrayAndCountUnique = rapidFlattenArrayAndCountUnique;
const countTermsInSchedule = () => {
    if (!deck_1.deck)
        return null;
    return (0, exports.countTerms)((0, card_data_1.getCardsInSchedule)());
};
exports.countTermsInSchedule = countTermsInSchedule;
if (isBrowser_1.isBrowser && isDev_1.isDev) {
    window["studyParticularWords"] = (...words) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, exports.studyParticularIds)((0, functions_1.getCardIdsFromTermIds)(words.map(functions_2.getHash)));
    });
    window["studyParticularIds"] = exports.studyParticularIds;
}
const exitVocabularyScreen = () => __awaiter(void 0, void 0, void 0, function* () {
    let url = window.location.pathname;
    if (url === "/vocabulary/play" || url === "/vocabulary/difficulty") {
        url = "/vocabulary";
    }
    yield (0, updateURL_1.updateURL)(url);
});
exports.exitVocabularyScreen = exitVocabularyScreen;
