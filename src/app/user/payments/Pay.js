"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const constants_1 = require("app/app/constants");
const log_1 = require("app/app/functions/log");
const updateURL_1 = require("app/router/actions/updateURL");
const actions_1 = require("app/user/payments/actions");
const PayPalButton_1 = require("app/user/payments/PayPalButton");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
class Form2 extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            price: constants_1.RECOMMENDED_PRICE_IN_US_DOLLARS,
        };
        this.onChange = (e) => {
            var _a, _b;
            this.setState({ price: e.target.value });
            const price = (0, actions_1.parsePrice)(e.target.value);
            (0, log_1.log)(price);
            if (price.error) {
                (_a = window.PayPalButtonActions) === null || _a === void 0 ? void 0 : _a.disable();
                if (price.error === "TOO_SMALL") {
                    this.setState({ error: "TOO_SMALL" });
                }
                else if (price.error === "INVALID_NUMBER") {
                    this.setState({ error: `Please enter a valid number` });
                }
                else if (price.error === "TOO_LARGE") {
                    this.setState({
                        error: `Thank you for your generosity, but the maximum allowed value is $${actions_1.MAX_PRICE}.`,
                    });
                }
            }
            else if (this.state.error) {
                (_b = window.PayPalButtonActions) === null || _b === void 0 ? void 0 : _b.enable();
                this.setState({ error: null });
            }
        };
    }
    componentDidMount() {
        // log({
        //   u: this.props.user,
        //   off: !process.env.REACT_APP_PWYW,
        // });
        if (!this.props.user || !process.env.REACT_APP_PWYW) {
            setTimeout(() => {
                (0, updateURL_1.updateURL)("/signup");
            }, 100);
        }
    }
    render() {
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ id: "pwyw-form" }, { children: [(0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("div", { children: "Enter amount: " }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "shared-input" }, { children: [(0, jsx_runtime_1.jsx)("input", { type: "text", name: "price", value: this.state.price, onChange: this.onChange, autoFocus: "autofocus" }), (0, jsx_runtime_1.jsx)("div", { children: "U.S. dollars" })] })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "form-error" }, { children: [this.state.error !== "TOO_SMALL" && this.state.error, " \u00A0"] }))] }), (0, jsx_runtime_1.jsx)("div", Object.assign({ style: {
                        display: this.state.error === "TOO_SMALL" ? "none" : "block",
                        opacity: this.state.error ? 0.3 : 1,
                    } }, { children: (0, jsx_runtime_1.jsx)(PayPalButton_1.PayPalButton, {}, 1) })), this.state.error === "TOO_SMALL" && ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "centered-button" }, { children: [(0, jsx_runtime_1.jsx)("button", Object.assign({ type: "button", className: "big", onClick: () => (0, actions_1.continueAfterPaying)({
                                price: 0,
                            }) }, { children: "Continue" })), parseInt(this.state.price.trim() || 0) !== 0 && ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "gray small center" }, { children: ["The smallest amount that can be processed is $", actions_1.MIN_PRICE, ", you won't be charged."] })))] })))] })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    user: state.user,
}))(Form2);
