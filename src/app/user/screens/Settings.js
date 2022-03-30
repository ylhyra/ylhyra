"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const updateURL_1 = require("app/router/actions/updateURL");
const actions_1 = require("app/user/actions");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
class Form2 extends react_1.default.Component {
    componentDidMount() {
        if (!this.props.user) {
            setTimeout(() => {
                (0, updateURL_1.updateURL)("/");
            }, 100);
        }
    }
    render() {
        return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "centered-button" }, { children: (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "big", onClick: actions_1.logout }, { children: "Log out" })) })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    user: state.user,
}))(Form2);
