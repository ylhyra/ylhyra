"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const actions_1 = require("maker/editor/Translator/actions");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
class Field extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.handleChange = (e) => {
            this.props.updateDefinitionValue({
                name: this.props.name,
                value: e.target.type === "checkbox" ? e.target.checked : e.target.value,
            });
        };
    }
    render() {
        const { translation, selected, name } = this.props;
        const definition = translation.definitions[(0, actions_1.wordsHash)(selected)] || {};
        const value = definition[name] || "";
        const Element = this.props.component;
        return ((0, jsx_runtime_1.jsx)(Element, Object.assign({ value: value, checked: value, name: name, type: this.props.type, placeholder: this.props.placeholder, id: this.props.id, autoComplete: "off", onChange: this.handleChange }, { children: this.props.children })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    translation: state.editor.translation,
    selected: state.editor.selected,
}), {
    updateDefinitionValue: actions_1.updateDefinitionValue,
})(Field);
