"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skeleton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
/* eslint-disable @typescript-eslint/no-unused-vars */
const time_1 = require("app/app/functions/time");
const format_1 = __importDefault(require("date-fns/format"));
const getDay_1 = __importDefault(require("date-fns/getDay"));
const getYear_1 = __importDefault(require("date-fns/getYear"));
const parseISO_1 = __importDefault(require("date-fns/parseISO"));
const tinycolor2_1 = __importDefault(require("tinycolor2"));
const util_1 = require("../util");
require("./styles.css");
const textColor = "#464646";
const baseColor = (0, tinycolor2_1.default)("#2d81ff");
const emptyColor = (0, tinycolor2_1.default)("white").darken(4).toHslString();
const marginLeft = 29;
const ActivityCalendar = ({ data, blockMargin = 4, blockRadius = 2, blockSize = 12, children, color = undefined, dateFormat = "d MMMM yyyy", fontSize = 14, hideColorLegend = false, hideMonthLabels = false, hideTotalCount = false, labels: labelsProp, loading = false, showWeekdayLabels = false, style = {}, theme: themeProp, weekStart = 0, // Sunday
 }) => {
    var _a;
    if (loading) {
        data = (0, util_1.generateEmptyData)();
    }
    if (data.length === 0) {
        return null;
    }
    const weeks = (0, util_1.groupByWeeks)(data, weekStart);
    const totalCount = data.reduce((sum, day) => sum + day.count, 0);
    const year = (0, getYear_1.default)((0, parseISO_1.default)((_a = data[0]) === null || _a === void 0 ? void 0 : _a.date));
    const theme = (0, util_1.getTheme)(themeProp, color);
    const labels = Object.assign({}, util_1.DEFAULT_LABELS, labelsProp);
    const textHeight = hideMonthLabels ? 0 : fontSize + 1;
    function getDimensions() {
        return {
            width: weeks.length * (blockSize + blockMargin) - blockMargin,
            height: textHeight + (blockSize + blockMargin) * 7 - blockMargin,
        };
    }
    function getTooltipMessage(contribution) {
        const date = (0, format_1.default)((0, parseISO_1.default)(contribution.date), dateFormat);
        if (!contribution.count) {
            return `${date}: Not played`;
        }
        return `${date}: ${(0, time_1.prettyPrintDaysMinutesHours)(contribution.count * time_1.minutes)}`;
    }
    function renderLabels() {
        const style = {
            fontSize,
        };
        if (!showWeekdayLabels && hideMonthLabels) {
            return null;
        }
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [showWeekdayLabels && ((0, jsx_runtime_1.jsx)("g", Object.assign({ className: (0, util_1.getClassName)("legend-weekday"), style: style }, { children: weeks[1].map((day, y) => {
                        if (!day || y % 2 === 0) {
                            return null;
                        }
                        const dayIndex = (0, getDay_1.default)((0, parseISO_1.default)(day.date));
                        return ((0, jsx_runtime_1.jsx)("text", Object.assign({ x: marginLeft - 4, y: textHeight +
                                (fontSize / 2 + blockMargin) +
                                (blockSize + blockMargin) * y +
                                2, textAnchor: "end", style: { color: textColor } }, { children: labels.weekdays
                                ? labels.weekdays[dayIndex]
                                : util_1.DEFAULT_WEEKDAY_LABELS[dayIndex] }), day.date));
                    }) }))), !hideMonthLabels && ((0, jsx_runtime_1.jsx)("g", Object.assign({ className: (0, util_1.getClassName)("legend-month"), style: style }, { children: (0, util_1.getMonthLabels)(weeks, labels.months).map(({ text, x }, index, labels) => {
                        // Skip the first month label if there's not enough space to the next one
                        if (index === 0 &&
                            labels[1] &&
                            labels[1].x - x <= util_1.MIN_DISTANCE_MONTH_LABELS) {
                            return null;
                        }
                        return ((0, jsx_runtime_1.jsx)("text", Object.assign({ x: (blockSize + blockMargin) * x + marginLeft, alignmentBaseline: "hanging", style: { color: textColor } }, { children: text }), x));
                    }) })))] }));
    }
    function renderBlocks() {
        return weeks
            .map((week, weekIndex) => week.map((day, dayIndex) => {
            if (!day) {
                return null;
            }
            const style = undefined;
            // const style = day.date.endsWith("01")
            //   ? {
            //       stroke: `rgba(0, 0, 0, 0.15)`,
            //     }
            //   : undefined;
            const y = textHeight + (blockSize + blockMargin) * dayIndex;
            return ((0, jsx_runtime_1.jsx)("rect", Object.assign({ x: 0, y: y, width: blockSize, height: blockSize, fill: day.level
                    ? baseColor.setAlpha(day.level).toHslString()
                    : emptyColor, rx: blockRadius, ry: blockRadius, className: "block", "data-date": day.date, "data-tip": children ? getTooltipMessage(day) : undefined, style: style }, { children: (0, jsx_runtime_1.jsx)("title", { children: getTooltipMessage(day) }) }), day.date));
        }))
            .map((week, x) => ((0, jsx_runtime_1.jsx)("g", Object.assign({ transform: `translate(${(blockSize + blockMargin) * x + marginLeft}, 0)` }, { children: week }), x)));
    }
    function renderFooter() {
        return null;
    }
    const { width, height } = getDimensions();
    const additionalStyles = {
        width,
        maxWidth: "100%",
    };
    return ((0, jsx_runtime_1.jsxs)("article", Object.assign({ className: util_1.NAMESPACE, style: Object.assign(Object.assign({}, style), additionalStyles) }, { children: [(0, jsx_runtime_1.jsxs)("svg", Object.assign({ width: width, height: height, viewBox: `0 0 ${width} ${height}`, className: "calendar" }, { children: [!loading && renderLabels(), renderBlocks()] })), renderFooter(), children] })));
};
const Skeleton = (props) => ((0, jsx_runtime_1.jsx)(ActivityCalendar, Object.assign({ data: [] }, props)));
exports.Skeleton = Skeleton;
exports.default = ActivityCalendar;
