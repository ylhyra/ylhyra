"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItalicsAndBold = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const exists_1 = __importDefault(require("app/app/functions/exists"));
const react_1 = __importDefault(require("react"));
class Definition extends react_1.default.PureComponent {
    render() {
        const { definition, id } = this.props;
        if (!(0, exists_1.default)(definition) || !definition.meaning) {
            return null;
        }
        return ((0, jsx_runtime_1.jsx)("small", Object.assign({ className: "tooltip", "data-not-text": "true", id: `${id}-tooltip`, hidden: true }, { children: definition.meaning && ((0, jsx_runtime_1.jsx)("span", Object.assign({ className: "meaning" }, { children: (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: {
                        __html: (0, exports.ItalicsAndBold)(definition.meaning),
                    } }) }))) })));
    }
}
exports.default = Definition;
const ItalicsAndBold = (input) => {
    return input
        .replace(/\*\*([^ ].+?[^ ])\*\*/g, "<b>$1</b>")
        .replace(/\*([^ ].+?[^ ])\*/g, "<i>$1</i>")
        .replace(/_([^ ].+?[^ ])_/g, "<i>$1</i>");
};
exports.ItalicsAndBold = ItalicsAndBold;
