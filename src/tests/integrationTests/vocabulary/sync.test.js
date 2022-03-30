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
const functions_1 = require("app/vocabulary/actions/easinessLevel/functions");
const percentageKnown_1 = require("app/vocabulary/actions/functions/percentageKnown");
const index_1 = require("tests/integrationTests/index");
const recipes_1 = require("tests/integrationTests/recipes");
exports.default = {
    "Progress saved upon signup": () => __awaiter(void 0, void 0, void 0, function* () {
        yield recipes_1.run.vocabulary_session();
        const known1 = (0, percentageKnown_1.PercentageKnownOverall)();
        yield recipes_1.run.signup_logout_login();
        // await wait(200);
        const known2 = (0, percentageKnown_1.PercentageKnownOverall)();
        (0, index_1.assert)((0, functions_1.getEasinessLevel)() === 0);
        (0, index_1.notNull)(known1, known2);
        (0, index_1.shouldEqual)(known1, known2);
    }),
    "Vocabulary same after having logged out and logged in": () => __awaiter(void 0, void 0, void 0, function* () {
        yield recipes_1.run.signup();
        yield recipes_1.run.vocabulary_session();
        const known1 = (0, percentageKnown_1.PercentageKnownOverall)();
        yield recipes_1.run.reset_and_login();
        const known2 = (0, percentageKnown_1.PercentageKnownOverall)();
        (0, index_1.notNull)(known1, known2);
        (0, index_1.shouldEqual)(known1, known2);
    }),
    "Vocabulary empty on log out": () => __awaiter(void 0, void 0, void 0, function* () {
        yield recipes_1.run.signup();
        yield recipes_1.run.vocabulary_session();
        yield recipes_1.run.logout();
        (0, index_1.shouldEqual)((0, percentageKnown_1.PercentageKnownOverall)(), 0);
    }),
};
