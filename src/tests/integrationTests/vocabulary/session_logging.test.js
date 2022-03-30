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
const index_1 = require("tests/integrationTests/index");
const recipes_1 = require("tests/integrationTests/recipes");
exports.default = {
    "Unfinished session correctly scheduled and logged": () => __awaiter(void 0, void 0, void 0, function* () {
        yield recipes_1.run.vocabulary_session({ dontEnd: true });
        yield recipes_1.run.fakeReload();
        (0, index_1.assert)(Object.keys(deck_1.deck.schedule).length > 0, "Schedule not saved for a logged out user");
        // TODO logging
    }),
    // "Unfinished session not scheduled if user is accidentally logged out":
    //   async () => {
    //     await run.signup();
    //     await run.vocabulary_session({ dontEnd: true });
    //     eraseCookie();
    //     await run.fakeReload();
    //     assert(Object.keys(deck.schedule).length === 0);
    //   },
};
