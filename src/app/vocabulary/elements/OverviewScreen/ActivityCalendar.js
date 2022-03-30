"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_activity_calendar_1 = __importDefault(require("app/app/functions/react-activity-calendar"));
const simplePlural_1 = require("app/app/functions/simplePlural");
const time_1 = require("app/app/functions/time");
const Spacer_1 = __importDefault(require("documents/templates/Spacer"));
const react_1 = require("react");
const react_redux_1 = require("react-redux");
class ActivityCalendar extends react_1.Component {
    render() {
        const { deck, overview } = this.props.vocabulary;
        if (!deck)
            return null;
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "vocabulary-overview-section" }, { children: [(0, jsx_runtime_1.jsx)(Spacer_1.default, { space: "10" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Activity streak:" }), " ", (0, simplePlural_1.withPlural)(overview.streak, "day"), " in a row"] }), overview.seconds_spent_this_week !== overview.seconds_spent_total && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Time played this week:" }), " ", (0, time_1.prettyPrintDaysMinutesHours)((overview.seconds_spent_this_week || 0) * time_1.seconds)] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Total time played:" }), " ", (0, time_1.prettyPrintDaysMinutesHours)((overview.seconds_spent_total || 0) * time_1.seconds)] }), (0, jsx_runtime_1.jsx)(Spacer_1.default, { space: "10" }), overview.calendar_data && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Activity overview:" }), (0, jsx_runtime_1.jsx)(react_activity_calendar_1.default, { data: overview.calendar_data, hideColorLegend: true, hideTotalCount: true, showWeekdayLabels: true, fontSize: 12, blockMargin: 3 })] }))] })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    vocabulary: state.vocabulary,
}))(ActivityCalendar);
