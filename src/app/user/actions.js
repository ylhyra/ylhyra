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
exports.updateUser = exports.existsSchedule = exports.isUserLoggedIn = exports.getUserFromCookie = exports.InitializeUser = exports.logout = exports.login = void 0;
const axios_1 = __importDefault(require("app/app/axios"));
const cookie_1 = require("app/app/functions/cookie");
const isBrowser_1 = require("app/app/functions/isBrowser");
const log_1 = require("app/app/functions/log");
const store_1 = __importDefault(require("app/app/store"));
const updateURL_1 = require("app/router/actions/updateURL");
const deck_1 = require("app/vocabulary/actions/deck");
const sync_1 = require("app/vocabulary/actions/userData/sync");
const actions_1 = require("app/vocabulary/elements/OverviewScreen/actions");
const functions_1 = require("documents/compile/functions/functions");
const login = (values) => __awaiter(void 0, void 0, void 0, function* () {
    const response = (yield axios_1.default.post("/api/user", values)).data;
    const { user_id, username, did_user_exist, error } = response;
    if (error)
        return error;
    store_1.default.dispatch({
        type: "LOAD_USER",
        content: {
            username,
            user_id,
        },
    });
    if (!did_user_exist) {
        if (values.save_progress !== "no") {
            yield (0, sync_1.sync)({ syncEverything: true });
        }
        else {
            (0, log_1.log)("Data not synced");
            deck_1.deck.reset();
        }
        if (process.env.REACT_APP_PWYW === "on") {
            void (0, updateURL_1.updateURL)("/pwyw");
        }
        else {
            // TODO: "Thank you for ..."
            void (0, updateURL_1.updateURL)("/vocabulary");
        }
    }
    else {
        /* TODO!!!!! */
        deck_1.deck.reset();
        yield (0, sync_1.sync)();
        void (0, updateURL_1.updateURL)("/vocabulary");
    }
    void (0, actions_1.clearOverview)();
});
exports.login = login;
const logout = () => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.post(`/api/user/logout`);
    deck_1.deck === null || deck_1.deck === void 0 ? void 0 : deck_1.deck.reset();
    (0, actions_1.clearOverview)();
    store_1.default.dispatch({
        type: "LOAD_USER",
        content: null,
    });
    void (0, updateURL_1.updateURL)("/frontpage");
});
exports.logout = logout;
const InitializeUser = () => {
    (0, exports.updateUser)();
};
exports.InitializeUser = InitializeUser;
const getUserFromCookie = () => {
    if (!isBrowser_1.isBrowser)
        return null;
    let cookie = (0, cookie_1.getCookie)("y");
    if (cookie) {
        let { user_id, username, username_encoded } = JSON.parse(atob(cookie));
        /* "username" is no longer used but is kept here temporarily for
         users who already have that cookie set */
        if (username_encoded) {
            username = (0, functions_1.DecodeDataInHTML)(username_encoded, true);
        }
        if (user_id) {
            return { user_id, username };
        }
    }
    return null;
};
exports.getUserFromCookie = getUserFromCookie;
const isUserLoggedIn = () => {
    return (0, exports.getUserFromCookie)() !== null;
};
exports.isUserLoggedIn = isUserLoggedIn;
const existsSchedule = () => {
    return (deck_1.deck === null || deck_1.deck === void 0 ? void 0 : deck_1.deck.schedule) && Object.keys(deck_1.deck.schedule).length >= 6;
};
exports.existsSchedule = existsSchedule;
/* Called on route changes */
// TODO!! Should sync
const updateUser = () => {
    var _a;
    const user = (0, exports.getUserFromCookie)();
    if (((_a = store_1.default.getState().user) === null || _a === void 0 ? void 0 : _a.user_id) !== (user === null || user === void 0 ? void 0 : user.user_id)) {
        store_1.default.dispatch({
            type: "LOAD_USER",
            content: user,
        });
    }
};
exports.updateUser = updateUser;
