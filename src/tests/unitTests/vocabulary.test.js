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
const functions_1 = require("app/vocabulary/actions/card/functions");
const initialize_1 = require("app/vocabulary/actions/initialize");
// const console = require("console");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, initialize_1.InitializeVocabulary)();
}));
test("siblings", () => {
    const card1 = (0, functions_1.getCardByText)("ég er");
    expect(card1.getSiblingCards().length).toBe(1);
    expect(card1.getSiblingCards()[0].printWord()).toBe("I am");
});
test("isTextSimilarTo", () => {
    const card1 = (0, functions_1.getCardByText)("Gaman að sjá þig."); // Nice to see you.
    expect(card1.phoneticHashArray).not.toBeFalsy();
    const card2 = (0, functions_1.getCardByText)("Það er gott að búa á Íslandi."); // It is nice ...
    expect(card1.isTextSimilarTo(card2)).toBe(true);
});
test("hasDependenciesInCommonWith", () => {
    expect((0, functions_1.getCardByText)("Er vikan þín búin að vera góð?").hasDependenciesInCommonWith((0, functions_1.getCardByText)("Það er gott að búa á Íslandi."))).toBe(true);
});
