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
exports.session_log_migration = exports.SESSION_LOG_MIGRATION_FINISHED__KEY = exports.calculateOverview = exports.clearOverview = void 0;
const axios_1 = __importDefault(require("app/app/axios"));
const log_1 = require("app/app/functions/log");
const math_1 = require("app/app/functions/math");
const time_1 = require("app/app/functions/time");
const store_1 = __importDefault(require("app/app/store"));
const deck_1 = require("app/vocabulary/actions/deck");
const percentageKnown_1 = require("app/vocabulary/actions/functions/percentageKnown");
const sync_1 = require("app/vocabulary/actions/userData/sync");
const userData_1 = require("app/vocabulary/actions/userData/userData");
const userDataSessions_1 = require("app/vocabulary/actions/userData/userDataSessions");
const underscore_1 = __importDefault(require("underscore"));
const MIN_DAYS_TO_SHOW = 2.5 * 30;
const MAX_DAYS_TO_SHOW = 365;
const clearOverview = () => __awaiter(void 0, void 0, void 0, function* () {
    store_1.default.dispatch({
        type: "LOAD_OVERVIEW",
        content: {
            loaded: false,
        },
    });
});
exports.clearOverview = clearOverview;
const calculateOverview = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!deck_1.deck)
        return null;
    yield (0, exports.session_log_migration)();
    let seconds_spent_total = 0;
    let seconds_spent_this_week = 0;
    const days_ago_to_seconds_spent = {};
    /* Get timestamp for the last 04:00 */
    let today_begins_at_timestamp = get_today_begins_at_timestamp();
    (0, userDataSessions_1.getSessions)().forEach((session) => {
        /* Today is 0 days ago */
        const days_ago = Math.ceil((today_begins_at_timestamp - session.timestamp) / time_1.days + 1) - 1;
        days_ago_to_seconds_spent[days_ago] =
            (days_ago_to_seconds_spent[days_ago] || 0) + session.seconds_spent;
        seconds_spent_total += session.seconds_spent;
        if (days_ago <= 6) {
            seconds_spent_this_week += session.seconds_spent;
        }
    });
    /* Count backwards the number of days to show in the calendar */
    let days_to_show_in_calendar = (0, math_1.clamp)(underscore_1.default.max(Object.keys(days_ago_to_seconds_spent).map((i) => parseInt(i))) + 7, MIN_DAYS_TO_SHOW, MAX_DAYS_TO_SHOW);
    /* Make sure the calendar shown starts on a Sunday */
    days_to_show_in_calendar += new Date(today_begins_at_timestamp - days_to_show_in_calendar * time_1.days).getDay() /* getDay counts the number of days since Sunday */;
    let calendar_data = [];
    for (let days_ago = days_to_show_in_calendar; days_ago >= 0; days_ago--) {
        const seconds = days_ago_to_seconds_spent[days_ago] || 0;
        const minutes = seconds / 60;
        let opacity = 0;
        if (minutes) {
            opacity = (0, math_1.mapValueToRange)({
                value: (0, math_1.mapZeroToInfinityToZeroToOne)({
                    input: minutes,
                    /* Spending 40 minutes fills eighty percent */
                    goal_input: 40,
                    goal_output: 0.8,
                }),
                input_from: 0,
                input_to: 1,
                output_from: 0.2,
                output_to: 1,
            });
        }
        calendar_data.push({
            count: Math.ceil(seconds / 60),
            date: new Date(today_begins_at_timestamp - days_ago * time_1.days)
                .toISOString()
                .substring(0, 10),
            /* Level from 0 to 1 */
            level: Math.min(opacity, 1),
        });
    }
    let streak = 0;
    for (let days_ago = 0; days_ago === 0 || days_ago_to_seconds_spent[days_ago]; days_ago++) {
        if (days_ago_to_seconds_spent[days_ago]) {
            streak++;
        }
    }
    /* A one-day streak does not count */
    if (streak === 1)
        streak = 0;
    store_1.default.dispatch({
        type: "LOAD_OVERVIEW",
        content: {
            streak,
            seconds_spent_total,
            seconds_spent_this_week,
            calendar_data,
            percentage_known_overall: (0, percentageKnown_1.PercentageKnownOverall)(),
            loaded: true,
        },
    });
});
exports.calculateOverview = calculateOverview;
/* Get timestamp for the last 04:00 */
const DAY_STARTS_AT = 4; /* The day starts at 04:00 local time */
const get_today_begins_at_timestamp = () => {
    const now = new Date();
    let today_begins_at_timestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), DAY_STARTS_AT, 0, 0).getTime();
    /* Go back one day if it's past midnight for the user but not yet 04:00 */
    if (now.getTime() < today_begins_at_timestamp) {
        today_begins_at_timestamp -= time_1.day;
    }
    return today_begins_at_timestamp;
};
exports.SESSION_LOG_MIGRATION_FINISHED__KEY = "session_log_migr";
const session_log_migration = () => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, userData_1.getUserData)(exports.SESSION_LOG_MIGRATION_FINISHED__KEY)) {
        (0, log_1.log)("Session log already migrated");
        return;
    }
    if (Object.keys(deck_1.deck.schedule).length > 0) {
        const data = (yield axios_1.default.get("/api/vocabulary/session_log_migration"))
            .data;
        if (!data || !Array.isArray(data) || data.length === 0)
            return;
        data.forEach((session) => {
            const id = userDataSessions_1.SESSION_PREFIX + session.timestamp / 1000;
            if ((0, userData_1.getUserData)(id))
                return;
            (0, userData_1.setUserData)(id, {
                seconds_spent: session.seconds_spent,
                timestamp: session.timestamp,
            }, "session");
        });
    }
    (0, userData_1.setUserData)(exports.SESSION_LOG_MIGRATION_FINISHED__KEY, true);
    (0, sync_1.sync)();
    // console.log(data);
});
exports.session_log_migration = session_log_migration;
