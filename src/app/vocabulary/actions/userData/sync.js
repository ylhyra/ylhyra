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
exports.syncIfNecessary = exports.sync = void 0;
const axios_1 = __importDefault(require("app/app/axios"));
const localStorage_1 = require("app/app/functions/localStorage");
const log_1 = require("app/app/functions/log");
const actions_1 = require("app/user/actions");
const deck_1 = require("app/vocabulary/actions/deck");
const userData_1 = require("app/vocabulary/actions/userData/userData");
const userDataSchedule_1 = require("app/vocabulary/actions/userData/userDataSchedule");
const actions_2 = require("app/vocabulary/elements/OverviewScreen/actions");
/**
 * TODO:
 * - skrá notanda í gögn!
 * - tékka hvort notandi sé enn skráður inn og hvort sami notandi sé enn skráður inn
 *
 * @returns {UserData}
 */
const sync = (options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    /** @type UserData */
    let user_data;
    if (Object.keys(((_a = deck_1.deck === null || deck_1.deck === void 0 ? void 0 : deck_1.deck.user_data) === null || _a === void 0 ? void 0 : _a.rows) || {}).length > 0) {
        user_data = deck_1.deck.user_data;
    }
    else {
        user_data = (0, localStorage_1.getFromLocalStorage)("vocabulary-user-data") || {};
    }
    /** @type UserDataRows */
    let rows = user_data.rows || {};
    const { lastSynced } = user_data;
    if (!options.isInitializing) {
        (0, userData_1.saveUserDataInLocalStorage)({ rows });
    }
    if (!(0, actions_1.isUserLoggedIn)()) {
        (0, log_1.log)(`Not synced to server as user isn't logged in`);
        return user_data;
    }
    const unsynced = getUnsynced(rows, options);
    const response = (yield axios_1.default.post(`/api/vocabulary/sync`, {
        unsynced,
        lastSynced: lastSynced || 0,
    })).data;
    /* Force recalculation of overview screen */
    if (response.rows.length > 0)
        (0, actions_2.clearOverview)();
    rows = mergeResponse(rows, response.rows);
    user_data = {
        rows,
        lastSynced: response.lastSynced,
    };
    (0, userData_1.saveUserDataInLocalStorage)(user_data, { assignToDeck: true });
    if (deck_1.deck) {
        deck_1.deck.schedule = (0, userDataSchedule_1.getScheduleFromUserData)(user_data);
    }
    (0, log_1.log)("Data synced");
    return user_data;
});
exports.sync = sync;
const syncIfNecessary = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!deck_1.deck)
        return;
    // TODO
    // const data = getFromLocalStorage("vocabulary-user-data");
    // /* Localstorage data has been updated in another tab, so we reload */
    // if (data) {
    //   if (data.lastSaved > deck.lastSaved) {
    //     saveUserDataInLocalStorage(data, { assignToDeck: true });
    //   }
    // }
    // if (isUserLoggedIn()) {
    //   /* Sync if more than 10 minutes since sync */
    //   if (now() > deck.lastSynced + 10 * 60 * 1000) {
    //     // TODO
    //     await sync();
    //   }
    // }
});
exports.syncIfNecessary = syncIfNecessary;
/**
 * @param {UserDataRows} obj
 * @param {object} options
 * @returns {UserDataRows}
 */
const getUnsynced = (obj, options) => {
    if (!obj)
        return {};
    const { syncEverything } = options;
    let to_save = {};
    Object.keys(obj).forEach((key) => {
        if (obj[key].needsSyncing || syncEverything) {
            to_save[key] = obj[key];
        }
    });
    return to_save;
};
/**
 * @param {UserDataRows} local
 * @param {UserDataRows} server
 * @returns {UserDataRows}
 */
const mergeResponse = (local, server) => {
    Object.keys(local).forEach((key) => {
        delete local[key].needsSyncing;
    });
    Object.keys(server).forEach((key) => {
        local[key] = server[key];
    });
    return local;
};
