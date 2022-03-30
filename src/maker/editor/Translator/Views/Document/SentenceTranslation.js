"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const actions_1 = require("maker/editor/Translator/actions");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const react_textarea_autosize_1 = __importDefault(require("react-textarea-autosize"));
class SentenceTranslation extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleEnter = (e) => {
            if (e.which === 13) {
                e.preventDefault();
            }
        };
        this.onFocus = () => {
            this.setState({
                focus: true,
            });
        };
        this.onBlur = () => {
            this.setState({
                focus: false,
            });
        };
        this.handleChange = (e, fieldName) => {
            this.props.updateSentence({
                sentence_id: this.props.id,
                fieldName: fieldName,
                value: e.target.value,
            });
        };
        this.shouldComponentUpdate = (nextProps) => {
            const { id } = this.props;
            if (this.props.suggestions !== nextProps.suggestions &&
                this.props.suggestions[id] !== nextProps.suggestions[id]) {
                return true;
            }
            if (this.props.translation.sentences[id] !==
                nextProps.translation.sentences[id]) {
                return true;
            }
            return false;
        };
        this.state = {
            focus: false,
        };
    }
    render() {
        const { translation, id, suggestions } = this.props;
        const sentence = translation.sentences[id] || {};
        let placeholder = "";
        if (suggestions && id in suggestions && suggestions[id].length > 0) {
            placeholder = suggestions[id][0].definition.meaning;
        }
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "sentence" }, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Translation" }), (0, jsx_runtime_1.jsx)(react_textarea_autosize_1.default, { className: "textarea", 
                            // focus={this.state.focus}
                            value: sentence.meaning || "", onKeyPress: this.handleEnter, onChange: (e) => this.handleChange(e, "meaning"), onFocus: this.onFocus, onBlur: this.onBlur, placeholder: placeholder, ref: "meaning" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Direct translation" }), (0, jsx_runtime_1.jsx)(react_textarea_autosize_1.default, { className: "textarea", 
                            // isFocused={this.state.focus}
                            value: sentence.direct || "", onKeyPress: this.handleEnter, onChange: (e) => this.handleChange(e, "direct"), onFocus: this.onFocus, onBlur: this.onBlur, ref: "direct" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("b", { children: "Note" }), (0, jsx_runtime_1.jsx)(react_textarea_autosize_1.default, { className: "textarea", 
                            // focus={this.state.focus}
                            onKeyPress: this.handleEnter, value: sentence.note || "", onChange: (e) => this.handleChange(e, "note"), onFocus: this.onFocus, onBlur: this.onBlur, ref: "note" })] })] })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    translation: state.editor.translation,
    suggestions: state.editor.suggestions,
}), { updateSentence: actions_1.updateSentence })(SentenceTranslation);
