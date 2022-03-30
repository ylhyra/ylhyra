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
const jsx_runtime_1 = require("react/jsx-runtime");
const messages_1 = __importDefault(require("app/app/error/messages"));
const simplePlural_1 = require("app/app/functions/simplePlural");
const actions_1 = require("app/user/actions");
const functions_1 = require("app/vocabulary/actions/functions");
const formik_1 = require("formik");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
class Form2 extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = () => {
            if (this.props.user) {
                setTimeout(() => {
                    // VIRKAR EKKI! Er keyrt aftur eftir submit af einhverjum ástæðum
                    // updateURL("/settings");
                }, 100);
            }
        };
        this.submit = (values, setSubmitting) => __awaiter(this, void 0, void 0, function* () {
            this.setState(values);
            // /* Execute invisible captcha */
            // if (!this.state.captcha_token && process.env.REACT_APP_HCAPTCHA_SITEKEY) {
            //   this.setState({
            //     message: "Verifying...",
            //     awaitingCaptcha: true,
            //   });
            //   this.captcha_element.current.execute();
            //   setSubmitting && setSubmitting(false);
            //   return;
            // }
            const error = yield (0, actions_1.login)(Object.assign(Object.assign({}, this.state), values));
            setSubmitting && setSubmitting(false);
            if (error) {
                this.setState({
                    error: messages_1.default[error] || error,
                });
            }
        });
        // this.captcha_element = React.createRef();
        this.state = {
            step: 1,
            type: this.props.type, // Either "signup" or "login"
        };
    }
    render() {
        const error = this.state.error && ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "form-error" }, { children: this.state.error })));
        const message = this.state.message && ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "" }, { children: (0, jsx_runtime_1.jsx)("b", { children: this.state.message }) })));
        const parent = this;
        const { submit } = parent;
        const isSignup = this.props.type === "signup";
        return ((0, jsx_runtime_1.jsxs)("div", { children: [this.props.above, (0, jsx_runtime_1.jsx)(formik_1.Formik, Object.assign({ initialValues: {
                        username: "",
                        email: "",
                        password: "",
                        save_progress: "yes",
                    }, validate: (values) => {
                        const errors = {};
                        if (!values.username.trim()) {
                            errors.username = "(required)";
                        }
                        if (values.email && !/@/.test(values.email)) {
                            errors.email = "Invalid email address";
                        }
                        if (!values.password) {
                            errors.password = "(required)";
                        }
                        return errors;
                    }, onSubmit: (values, { setSubmitting }) => {
                        submit(values, setSubmitting);
                    } }, { children: ({ isSubmitting }) => ((0, jsx_runtime_1.jsxs)(formik_1.Form, { children: [(0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsxs)("div", { children: [isSignup ? "Choose a username:" : "Username or email:", " ", (0, jsx_runtime_1.jsx)(formik_1.ErrorMessage, { name: "username", component: "span", className: "form-error" })] }), (0, jsx_runtime_1.jsx)(formik_1.Field, { type: "text", name: "username" })] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsxs)("div", { children: [isSignup ? "Choose a password:" : "Password:", " ", (0, jsx_runtime_1.jsx)(formik_1.ErrorMessage, { name: "password", component: "span", className: "form-error" })] }), (0, jsx_runtime_1.jsx)(formik_1.Field, { type: "password", name: "password" })] }), isSignup && ((0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Email ", (0, jsx_runtime_1.jsx)("span", Object.assign({ className: "gray" }, { children: "(optional)" })), ":", " ", (0, jsx_runtime_1.jsx)(formik_1.ErrorMessage, { name: "email", component: "span", className: "form-error" })] }), (0, jsx_runtime_1.jsx)(formik_1.Field, { type: "email", name: "email" })] })), isSignup && (0, actions_1.existsSchedule)() && ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "form-section" }, { children: ["You have already studied", " ", (0, simplePlural_1.withPlural)((0, functions_1.countTermsInSchedule)(), "term"), " while logged out. Do you want to:", (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)(formik_1.Field, { type: "radio", name: "save_progress", value: "yes" }), "Save progress to your new account"] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)(formik_1.Field, { type: "radio", name: "save_progress", value: "no" }), "Discard progress"] }), (0, jsx_runtime_1.jsx)("br", {})] }))), !isSubmitting && error, message, (0, jsx_runtime_1.jsx)("button", Object.assign({ type: "submit", className: "big", disabled: isSubmitting }, { children: isSignup ? "Continue" : "Log in" }))] })) }))] }));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    route: state.route,
    user: state.user,
    vocabulary: state.vocabulary,
}))(Form2);
