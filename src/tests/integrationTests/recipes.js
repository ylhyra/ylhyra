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
exports.run = void 0;
const axios_1 = __importDefault(require("app/app/axios"));
const cookie_1 = require("app/app/functions/cookie");
const updateURL_1 = require("app/router/actions/updateURL");
const actions_1 = require("app/user/actions");
const deck_1 = require("app/vocabulary/actions/deck");
const percentageKnown_1 = require("app/vocabulary/actions/functions/percentageKnown");
const initialize_1 = require("app/vocabulary/actions/initialize");
const index_1 = require("tests/integrationTests/index");
/*
  Various smaller recipes
*/
exports.run = {
    reset: () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, actions_1.logout)();
        localStorage.clear();
        (0, cookie_1.eraseCookie)();
        deck_1.deck === null || deck_1.deck === void 0 ? void 0 : deck_1.deck.reset();
        yield (0, initialize_1.InitializeVocabulary)();
        yield (0, index_1.wait)(20);
        (0, index_1.assert)((0, percentageKnown_1.PercentageKnownOverall)() === 0);
        yield (0, updateURL_1.updateURL)("/vocabulary");
    }),
    start_session: () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, updateURL_1.updateURL)("/vocabulary/play");
        yield deck_1.deck.session.InitializeSession();
    }),
    end_session: () => __awaiter(void 0, void 0, void 0, function* () {
        yield deck_1.deck.session.sessionDone();
    }),
    vocabulary_session: (options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        if (!options.dontStart) {
            yield exports.run.start_session();
        }
        if (options.values) {
            options.values.forEach((v) => {
                deck_1.deck.session.answer(v);
            });
        }
        else {
            for (let i = 0; i < 10; i++) {
                deck_1.deck.session.answer(Math.ceil(Math.random() * 3));
            }
        }
        if (!options.dontEnd) {
            yield exports.run.end_session();
        }
    }),
    start_vocabulary_session: (options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        yield exports.run.vocabulary_session({
            values: options.values,
            dontEnd: true,
        });
    }),
    continue_vocabulary_session: (options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        yield exports.run.vocabulary_session({
            values: options.values,
            dontStart: true,
            dontEnd: true,
        });
    }),
    end_vocabulary_session: (options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        yield exports.run.vocabulary_session({
            values: options.values,
            dontStart: true,
        });
    }),
    fakeReload: () => __awaiter(void 0, void 0, void 0, function* () {
        deck_1.deck.clear();
        (0, updateURL_1.updateURL)("/vocabulary");
        yield (0, index_1.wait)(500);
        yield (0, initialize_1.InitializeVocabulary)();
    }),
    signup: () => __awaiter(void 0, void 0, void 0, function* () {
        const username = "test_" + Math.round(Math.random() * 1000000);
        yield (0, actions_1.login)({
            type: "signup",
            username,
            password: username,
        });
        window.last_username = username;
        return username;
    }),
    login: (username) => __awaiter(void 0, void 0, void 0, function* () {
        username = username || window.last_username;
        if (!username) {
            throw new Error("No username");
        }
        yield (0, actions_1.login)({
            type: "login",
            username,
            password: username,
        });
    }),
    logout: () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, actions_1.logout)();
    }),
    logout_only_in_backend: () => __awaiter(void 0, void 0, void 0, function* () {
        yield axios_1.default.post(`/api/user/logout`);
    }),
    signup_logout_login: () => __awaiter(void 0, void 0, void 0, function* () {
        yield exports.run.signup();
        yield exports.run.reset_and_login();
    }),
    reset_and_login: () => __awaiter(void 0, void 0, void 0, function* () {
        yield exports.run.reset();
        yield exports.run.login();
    }),
};
window.run = exports.run;
