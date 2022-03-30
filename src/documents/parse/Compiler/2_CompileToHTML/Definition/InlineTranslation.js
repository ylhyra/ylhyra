"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const exists_1 = __importDefault(require("app/app/functions/exists"));
const Tooltip_1 = require("documents/parse/Compiler/2_CompileToHTML/Definition/Tooltip");
const react_1 = __importDefault(require("react"));
/*
  Maybe TODO:
    Should we attempt to squish InlineTranslation into two lines when applicable?
    That would require finding width of single & double lines and selecting the best.
    Would be cool, but double lines hardly fit between spaces.
*/
class InlineTranslation extends react_1.default.PureComponent {
    render() {
        const { definition } = this.props;
        if (!(0, exists_1.default)(definition) || !definition.show_definition_above) {
            return null;
        }
        const text = definition.inline_translation || definition.meaning;
        return [
            (0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "hidden" }, { children: [" ", "("] }), 1),
            (0, jsx_runtime_1.jsx)("span", Object.assign({ className: "inline_translation", "data-not-text": "true", 
                // hidden={true}
                lang: "en" }, { children: (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: { __html: (0, Tooltip_1.ItalicsAndBold)(text) } }) }), 2),
            (0, jsx_runtime_1.jsx)("span", Object.assign({ className: "hidden" }, { children: ")" }), 3),
        ];
    }
}
exports.default = InlineTranslation;
