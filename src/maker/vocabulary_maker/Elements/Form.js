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
const formik_1 = require("formik");
const keycode_1 = __importDefault(require("keycode"));
const actions_1 = require("maker/vocabulary_maker/actions/actions");
const didYouMean_1 = require("maker/vocabulary_maker/actions/didYouMean");
const functions_1 = require("maker/vocabulary_maker/compile/functions");
const rowTitles_1 = require("maker/vocabulary_maker/compile/rowTitles");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const underscore_1 = __importDefault(require("underscore"));
class Form2 extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.componentDidMount = () => __awaiter(this, void 0, void 0, function* () {
            window.addEventListener("keydown", this.checkKey);
            window.addEventListener("keyup", this.keyUp);
        });
        // componentDidUpdate() {
        //   if (!this.props.vocabularyMaker.selected) return;
        //   if (!document.querySelector("form")) return;
        //   window.scroll(
        //     0,
        //     document.querySelector("form").offsetTop +
        //       document.querySelector("#content").offsetTop
        //   );
        // }
        this.keyUp = () => {
            // this.isKeyDown = false;
        };
        this.set = (name, val) => {
            this.formRef.current.setFieldValue(name, val || "");
            console.log({ name, val });
            // submit(
            //   {
            //     ...row,
            //     ...data,
            //     [name]: val,
            //   },
            //   false
            // );
        };
        this.checkKey = (e) => {
            var _a, _b, _c;
            const key = keycode_1.default.names[e.keyCode];
            if (e.altKey && e.metaKey)
                return;
            console.log({ key });
            // return;
            if (!this.props.vocabularyMaker.selected)
                return;
            const rows = this.props.vocabularyMaker.data;
            const row = rows[rows.findIndex((j) => j.row_id === this.props.vocabularyMaker.selected)];
            let number;
            if (e.keyCode === 49)
                number = 1;
            if (e.keyCode === 50)
                number = 2;
            if (e.keyCode === 51)
                number = 3;
            if (e.keyCode === 52)
                number = 4;
            if (e.keyCode === 53)
                number = 5;
            if (e.keyCode === 54)
                number = 6;
            if (!e.metaKey && !document.querySelector(":focus")) {
                let imp = ["s", "d", "f", "g"].indexOf(key);
                if (imp !== -1) {
                    this.set("importance", 5 - imp);
                }
                let diff = ["j", "k", "l", ";"].indexOf(key);
                if (diff !== -1) {
                    this.set("difficulty", diff + 1);
                    return (_a = this.formRef.current) === null || _a === void 0 ? void 0 : _a.handleSubmit();
                }
                // if (!row.importance && !row.difficulty) {
                //   const { importance, difficulty } = this.formRef.current.values;
                //   if (importance && difficulty && Database.mode === "review_importance") {
                //     return this.formRef.current?.handleSubmit();
                //   }
                // }
                if (key === "space") {
                    e.preventDefault();
                    return (_b = this.formRef.current) === null || _b === void 0 ? void 0 : _b.handleSubmit();
                }
            }
            if (e.metaKey && e.keyCode === 75 /* Command K */) {
                this.set("depends_on", "");
                this.set("lemmas", row.depends_on);
            }
            else if (e.metaKey && e.keyCode === 85 /* Command U */) {
                this.set("lemmas", row.icelandic + "%");
            }
            else if (e.metaKey && e.keyCode === 73 /* Command I */) {
                this.set("alternative_id", row.icelandic);
                e.preventDefault();
            }
            else if ((e.altKey || e.metaKey) && number) {
                this.set("level", number);
                e.preventDefault();
            }
            else if (e.keyCode === 13 /* Enter */) {
                (_c = this.formRef.current) === null || _c === void 0 ? void 0 : _c.handleSubmit();
            }
            else if (e.keyCode === 27 /* Esc */) {
                (0, actions_1.selectNext)(this.props.vocabularyMaker.selected);
            }
        };
        this.state = {};
        this.formRef = react_1.default.createRef();
        setTimeout(() => {
            window.j = this.formRef;
        }, 100);
    }
    componentWillUnmount() {
        window.removeEventListener("keydown", this.checkKey);
        window.addEventListener("keyup", this.keyUp);
    }
    render() {
        const { row } = this.props;
        const { selectedField } = this.state;
        let initialValues = row;
        rowTitles_1.row_titles.forEach((i) => (initialValues[i] = row[i] || ""));
        const shownRowTitles = underscore_1.default.uniq([
            ...rowTitles_1.row_titles.filter((row_title) => rowTitles_1.row_info[row_title].alwaysShow),
            selectedField,
            ...rowTitles_1.row_titles.filter((row_title) => row[row_title]),
        ].filter(Boolean));
        const unshownRowTitles = underscore_1.default.difference(rowTitles_1.row_titles, shownRowTitles);
        return ((0, jsx_runtime_1.jsx)(formik_1.Formik, Object.assign({ initialValues: initialValues, innerRef: this.formRef, enableReinitialize: true, validateOnChange: false, validate: (values) => {
                const errors = {};
                if (/,/.test(values.icelandic)) {
                    errors.icelandic = "Comma not allowed";
                }
                if (/,/.test(values.english)) {
                    errors.english = "Comma not allowed";
                }
                if (!values.level && !(0, functions_1.getDeckName)() && values.english) {
                    errors.level = "Required";
                }
                return errors;
            }, onSubmit: (values) => {
                // document.querySelector("[name=userLevel]").focus();
                (0, actions_1.submit)(values);
            } }, { children: () => ((0, jsx_runtime_1.jsxs)(formik_1.Form, { children: [(0, jsx_runtime_1.jsx)("div", { children: !row["english"] &&
                            (0, didYouMean_1.didYouMeanSuggestions)(row["icelandic"], row.row_id) }), shownRowTitles.map((row_name) => {
                        const cur_row_info = rowTitles_1.row_info[row_name];
                        const { options } = cur_row_info;
                        return ((0, jsx_runtime_1.jsxs)("label", Object.assign({ htmlFor: row_name }, { children: [(0, jsx_runtime_1.jsxs)("b", { children: [(0, rowTitles_1.formatRowName)(row_name), ":"] }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(formik_1.ErrorMessage, { name: row_name, component: "div", className: "form-error" }), (0, jsx_runtime_1.jsx)(formik_1.Field
                                // type={row_name === "userLevel" ? "number" : "text"}
                                , Object.assign({ 
                                    // type={row_name === "userLevel" ? "number" : "text"}
                                    type: "text", as: options ? "select" : "", autoFocus: (() => {
                                        if (actions_1.Database.mode === "review_importance")
                                            return;
                                        // return row_name === "userLevel";
                                        if (selectedField)
                                            return row_name === selectedField;
                                        if (!row["icelandic"])
                                            return row_name === "icelandic";
                                        if (!row["english"])
                                            return row_name === "english";
                                        if (!row["depends_on"])
                                            return row_name === "depends_on";
                                        if (!row["lemmas"])
                                            return row_name === "lemmas";
                                        return row_name === "level";
                                    })(), name: row_name, id: row_name, size: (() => {
                                        var _a;
                                        // if (row_name === "userLevel") return 1;
                                        if (options)
                                            return 1; //options.length + 1;
                                        // if (options) return 1;
                                        return ((_a = row[row_name]) === null || _a === void 0 ? void 0 : _a.toString().length) || 2;
                                    })(), spellCheck: (() => {
                                        if (row_name === "english")
                                            return true;
                                        if (row_name === "note")
                                            return true;
                                        if (row_name === "note_regarding_english")
                                            return true;
                                    })(), lang: (() => {
                                        if (row_name === "english")
                                            return "en";
                                        if (row_name === "note")
                                            return "en";
                                        if (row_name === "note_regarding_english")
                                            return "en";
                                        return "is";
                                    })(), onKeyUp: (e) => {
                                        if (options)
                                            return;
                                        e.target.setAttribute("size", e.target.value.toString().length || 2);
                                    } }, { children: options && [
                                        (0, jsx_runtime_1.jsx)("option", Object.assign({ value: "" }, { children: "\u2013" }), 100),
                                        options.map((option) => ((0, jsx_runtime_1.jsx)("option", Object.assign({ value: option.value }, { children: option.title }), option.value))),
                                    ] }))] }), row_name));
                    }), (0, jsx_runtime_1.jsx)("br", {}), unshownRowTitles.map((row_name) => ((0, jsx_runtime_1.jsx)("button", Object.assign({ type: "button", className: "simple-button gray-button", onClick: () => {
                            this.setState({
                                selectedField: row_name,
                            });
                        }, style: {
                            margin: "1px 2px 1px 0",
                        } }, { children: (0, rowTitles_1.formatRowName)(row_name) }), row_name))), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("button", Object.assign({ type: "submit" }, { children: "Submit" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ type: "button", className: "", onClick: () => (0, actions_1.ignore_for_now)(row.row_id) }, { children: "Ignore" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ type: "button", className: "red", onClick: () => (0, actions_1.delete_row)(row.row_id) }, { children: "Delete" }))] })) }), row.row_id));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    vocabulary: state.vocabulary,
    vocabularyMaker: state.vocabularyMaker,
}))(Form2);
