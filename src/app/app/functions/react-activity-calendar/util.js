"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_LABELS = exports.DEFAULT_WEEKDAY_LABELS = exports.DEFAULT_MONTH_LABELS = exports.generateEmptyData = exports.getClassName = exports.getTheme = exports.createCalendarTheme = exports.getMonthLabels = exports.groupByWeeks = exports.MIN_DISTANCE_MONTH_LABELS = exports.NAMESPACE = void 0;
const differenceInCalendarDays_1 = __importDefault(require("date-fns/differenceInCalendarDays"));
const eachDayOfInterval_1 = __importDefault(require("date-fns/eachDayOfInterval"));
const formatISO_1 = __importDefault(require("date-fns/formatISO"));
const getDay_1 = __importDefault(require("date-fns/getDay"));
const getMonth_1 = __importDefault(require("date-fns/getMonth"));
const nextDay_1 = __importDefault(require("date-fns/nextDay"));
const parseISO_1 = __importDefault(require("date-fns/parseISO"));
const subWeeks_1 = __importDefault(require("date-fns/subWeeks"));
const tinycolor2_1 = __importDefault(require("tinycolor2"));
exports.NAMESPACE = "react-activity-calendar";
exports.MIN_DISTANCE_MONTH_LABELS = 2;
const DEFAULT_THEME = createCalendarTheme("#042a33");
function groupByWeeks(days, weekStart = 0 // 0 = Sunday
) {
    if (days.length === 0) {
        return [];
    }
    // The calendar expects a continuous sequence of days, so fill gaps with empty activity.
    const normalizedDays = normalizeCalendarDays(days);
    // Determine the first date of the calendar. If the first contribution date is not
    // specified week day the desired day one week earlier will be selected.
    const firstDate = (0, parseISO_1.default)(normalizedDays[0].date);
    const firstCalendarDate = (0, getDay_1.default)(firstDate) === weekStart
        ? firstDate
        : (0, subWeeks_1.default)((0, nextDay_1.default)(firstDate, weekStart), 1);
    // In order to correctly group contributions by week it is necessary to left pad the list,
    // because the first date might not be desired week day.
    const paddedDays = [
        ...Array((0, differenceInCalendarDays_1.default)(firstDate, firstCalendarDate)).fill(undefined),
        ...normalizedDays,
    ];
    return Array(Math.ceil(paddedDays.length / 7))
        .fill(undefined)
        .map((_, calendarWeek) => paddedDays.slice(calendarWeek * 7, calendarWeek * 7 + 7));
}
exports.groupByWeeks = groupByWeeks;
function normalizeCalendarDays(days) {
    const daysMap = days.reduce((map, day) => {
        map.set(day.date, day);
        return map;
    }, new Map());
    return (0, eachDayOfInterval_1.default)({
        start: (0, parseISO_1.default)(days[0].date),
        end: (0, parseISO_1.default)(days[days.length - 1].date),
    }).map((day) => {
        const date = (0, formatISO_1.default)(day, { representation: "date" });
        if (daysMap.has(date)) {
            return daysMap.get(date);
        }
        return {
            date,
            count: 0,
            level: 0,
        };
    });
}
function getMonthLabels(weeks, monthNames = exports.DEFAULT_MONTH_LABELS) {
    return weeks
        .reduce((labels, week, index) => {
        const firstWeekDay = week.find((day) => day !== undefined);
        if (!firstWeekDay) {
            throw new Error(`Unexpected error: Week is empty: [${week}]`);
        }
        const month = monthNames[(0, getMonth_1.default)((0, parseISO_1.default)(firstWeekDay.date))];
        const prev = labels[labels.length - 1];
        if (index === 0 || prev.text !== month) {
            return [
                ...labels,
                {
                    x: index,
                    y: 0,
                    text: month,
                },
            ];
        }
        return labels;
    }, [])
        .filter((label, index, labels) => {
        if (index === 0) {
            return labels[1] && labels[1].x - label.x > exports.MIN_DISTANCE_MONTH_LABELS;
        }
        return true;
    });
}
exports.getMonthLabels = getMonthLabels;
function createCalendarTheme(baseColor) {
    const base = (0, tinycolor2_1.default)(baseColor);
    if (!base.isValid()) {
        return DEFAULT_THEME;
    }
    // return {
    //   level4: base.setAlpha(0.92).toHslString(),
    //   level3: base.setAlpha(0.76).toHslString(),
    //   level2: base.setAlpha(0.6).toHslString(),
    //   level1: base.setAlpha(0.44).toHslString(),
    //   level0: emptyColor,
    // };
}
exports.createCalendarTheme = createCalendarTheme;
function getTheme(theme, color) {
    if (theme) {
        return Object.assign({}, DEFAULT_THEME, theme);
    }
    if (color) {
        return createCalendarTheme(color);
    }
    return DEFAULT_THEME;
}
exports.getTheme = getTheme;
function getClassName(name, styles) {
    if (styles) {
        return `${exports.NAMESPACE}__${name} ${styles}`;
    }
    return `${exports.NAMESPACE}__${name}`;
}
exports.getClassName = getClassName;
function generateEmptyData() {
    const year = new Date().getFullYear();
    const days = (0, eachDayOfInterval_1.default)({
        start: new Date(year, 0, 1),
        end: new Date(year, 11, 31),
    });
    return days.map((date) => ({
        date: (0, formatISO_1.default)(date, { representation: "date" }),
        count: 0,
        level: 0,
    }));
}
exports.generateEmptyData = generateEmptyData;
exports.DEFAULT_MONTH_LABELS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
exports.DEFAULT_WEEKDAY_LABELS = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
];
exports.DEFAULT_LABELS = {
    months: exports.DEFAULT_MONTH_LABELS,
    weekdays: exports.DEFAULT_WEEKDAY_LABELS,
    totalCount: "{{count}} contributions in {{year}}",
    legend: {
        less: "Less",
        more: "More",
    },
};
