"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const exists_1 = __importDefault(require("app/app/functions/exists"));
const Tooltip_1 = require("documents/parse/Compiler/2_CompileToHTML/Definition/Tooltip");
const react_1 = __importDefault(require("react"));
class SentenceBox extends react_1.default.PureComponent {
    render() {
        const { definition } = this.props;
        if (!(0, exists_1.default)(definition) ||
            !(definition.meaning || definition.direct || definition.note))
            return null;
        return [
            (0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "box", id: `${this.props.id}-box`, "data-ignore": "true", "data-not-text": "true", hidden: true, lang: "en" }, { children: [definition.meaning && ((0, jsx_runtime_1.jsx)("span", Object.assign({ className: "meaning" }, { children: (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: {
                                __html: (0, Tooltip_1.ItalicsAndBold)(definition.meaning),
                            } }) }))), definition.direct && ((0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "direct" }, { children: ["\u201C", (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: {
                                    __html: (0, Tooltip_1.ItalicsAndBold)(definition.direct),
                                } }), "\u201D"] }))), definition.note && ((0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "note small" }, { children: [(0, jsx_runtime_1.jsx)("label", { children: "Note" }), (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: {
                                    __html: (0, Tooltip_1.ItalicsAndBold)(definition.note),
                                } })] })))] }), 1),
            (0, jsx_runtime_1.jsx)("span", { className: "sentence-overlay", id: `${this.props.id}-sentence-overlay`, "data-ignore": "true" }, 2),
        ];
    }
}
exports.default = SentenceBox;
