"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const exists_1 = __importDefault(require("app/app/functions/exists"));
const Tooltip_1 = require("documents/parse/Compiler/2_CompileToHTML/Definition/Tooltip");
const react_1 = __importDefault(require("react"));
class WordBox extends react_1.default.PureComponent {
    render() {
        var _a, _b, _c, _d, _e, _f;
        const { definition } = this.props;
        if (!(0, exists_1.default)(definition) ||
            (!definition.base &&
                !definition.base_meaning &&
                !definition.base_direct &&
                !definition.note &&
                !definition.direct))
            return null;
        return ((0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "word-box", id: `${this.props.id}-box`, "data-not-text": "true", hidden: true, lang: "en" }, { children: [(0, jsx_runtime_1.jsxs)("span", { children: [((_a = definition.base) === null || _a === void 0 ? void 0 : _a.trim()) && ((0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "base" }, { children: [(0, jsx_runtime_1.jsx)("label", { children: "Base word" }), (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: {
                                        __html: (0, Tooltip_1.ItalicsAndBold)(definition.base),
                                    } })] }))), ((_b = definition.base_meaning) === null || _b === void 0 ? void 0 : _b.trim()) && ((0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "base_meaning" }, { children: [(0, jsx_runtime_1.jsx)("label", { children: "Meaning of base word" }), (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: {
                                        __html: (0, Tooltip_1.ItalicsAndBold)(definition.base_meaning),
                                    } })] }))), ((_c = definition.base_direct) === null || _c === void 0 ? void 0 : _c.trim()) && ((0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "base_direct" }, { children: [(0, jsx_runtime_1.jsx)("label", { children: "Literal meaning of base word" }), "\u201C", (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: {
                                        __html: (0, Tooltip_1.ItalicsAndBold)(definition.base_direct),
                                    } }), "\u201D"] }))), ((_d = definition.direct) === null || _d === void 0 ? void 0 : _d.trim()) && ((0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "" }, { children: [(0, jsx_runtime_1.jsx)("label", { children: "Literal meaning of word" }), "\u201C", (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: {
                                        __html: (0, Tooltip_1.ItalicsAndBold)(definition.direct),
                                    } }), "\u201D"] }))), ((_e = definition.note) === null || _e === void 0 ? void 0 : _e.trim()) && ((0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "small" }, { children: [(0, jsx_runtime_1.jsx)("label", { children: "Note" }), (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: {
                                        __html: (0, Tooltip_1.ItalicsAndBold)(definition.note),
                                    } })] }))), definition.grammatical_analysis &&
                            definition.grammatical_analysis.trim() && ((0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "small" }, { children: [(0, jsx_runtime_1.jsx)("label", { children: "Note" }), definition.grammatical_analysis] })))] }), ((_f = definition.sound) === null || _f === void 0 ? void 0 : _f.length) > 0 && (0, jsx_runtime_1.jsx)("span", { children: "\uD83D\uDD08" }), definition.pronunciation && ((0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "small" }, { children: [(0, jsx_runtime_1.jsx)("label", { children: "Pronunciation" }), (0, jsx_runtime_1.jsx)("span", { className: "pronunciation", dangerouslySetInnerHTML: {
                                __html: definition.pronunciation,
                            } })] })))] })));
    }
}
exports.default = WordBox;
