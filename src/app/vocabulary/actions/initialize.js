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
exports.InitializeVocabulary = void 0;
const axios_1 = __importDefault(require("app/app/axios"));
const isDev_1 = require("app/app/functions/isDev");
const localStorage_1 = require("app/app/functions/localStorage");
const log_1 = require("app/app/functions/log");
const store_1 = __importDefault(require("app/app/store"));
const deck_1 = __importDefault(require("app/vocabulary/actions/deck"));
const sync_1 = require("app/vocabulary/actions/userData/sync");
const userDataSchedule_1 = require("app/vocabulary/actions/userData/userDataSchedule");
const actions_1 = require("app/vocabulary/elements/OverviewScreen/actions");
const functions_1 = require("maker/vocabulary_maker/compile/functions");
const InitializeVocabulary = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, log_1.log)("Downloading database");
    const database = (yield axios_1.default.get(`/api/vocabulary/vocabulary_database${(0, functions_1.getDeckName)()}.json?v=${getBuildId()}`)).data;
    /** @type UserData */
    const user_data = yield (0, sync_1.sync)({ isInitializing: true });
    const schedule = (0, userDataSchedule_1.getScheduleFromUserData)(user_data);
    const session = (0, localStorage_1.getFromLocalStorage)("vocabulary-session");
    // TODO: log
    // if (getFromLocalStorage("vocabulary-session-remaining")) {
    //   session_log.push({
    //     //       seconds_spent
    //     // timestamp
    //   });
    // }
    const deck = new deck_1.default({
        database,
        schedule,
        session,
        user_data,
    });
    store_1.default.dispatch({
        type: "LOAD_DECK",
        content: deck,
    });
    (0, actions_1.clearOverview)();
});
exports.InitializeVocabulary = InitializeVocabulary;
let build_id;
const getBuildId = () => {
    var _a;
    if (isDev_1.isDev)
        return Math.random();
    if (build_id)
        return build_id;
    build_id =
        ((_a = document
            .querySelector('meta[name="vocabulary_id"]')) === null || _a === void 0 ? void 0 : _a.getAttribute("content")) || "";
    return build_id;
};
