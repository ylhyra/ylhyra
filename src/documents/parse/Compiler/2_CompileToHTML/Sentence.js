"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const jsx_runtime_1 = require("react/jsx-runtime");
const exists_1 = __importDefault(require("app/app/functions/exists"));
const Sentence_1 = __importDefault(require("documents/parse/Compiler/2_CompileToHTML/Definition/Box/Sentence"));
const react_2 = __importDefault(require("react"));
class Sentence extends react_2.default.Component {
    render() {
        const { id, definition } = this.props;
        let attrs = {};
        let classes = [];
        if ((0, exists_1.default)(definition) && definition.meaning.trim()) {
            attrs = {
                "data-sentence-has-definition": true,
            };
        }
        else {
            classes.push("missing");
        }
        // console.log(this.props.children)
        return [
            (0, jsx_runtime_1.jsx)(Sentence_1.default, { id: id, definition: definition, sentence: true, hidden: true }, 1),
            (0, react_1.createElement)("span", Object.assign({ className: `sentence ${classes.join(" ")}` }, attrs, { id: id, "data-will-have-audio": "true", key: 2, lang: "is" }), this.props.children),
        ];
    }
}
exports.default = Sentence;
