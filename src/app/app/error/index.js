"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notify = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const analytics_1 = __importDefault(require("app/app/analytics"));
const messages_1 = __importDefault(require("app/app/error/messages"));
const store_1 = __importDefault(require("app/app/store"));
const react_redux_1 = require("react-redux");
const Notification = (props) => {
    if (!props.error)
        return null;
    let { message } = props.error;
    if (message in messages_1.default) {
        message = messages_1.default[message];
    }
    return (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "notification error" }, { children: message }));
};
exports.default = (0, react_redux_1.connect)((state) => ({
    error: state.error,
}))(Notification);
const notify = (message) => {
    window.scrollTo(0, 0);
    analytics_1.default.error(message);
    store_1.default.dispatch({
        type: "ERROR",
        content: {
            message: message,
        },
    });
};
exports.notify = notify;
