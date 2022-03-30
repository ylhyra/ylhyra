"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const exists_1 = __importDefault(require("app/app/functions/exists"));
const UpdateID_1 = require("documents/parse/Compiler/1_Precompile/UpdateID");
const Word_1 = __importDefault(require("documents/parse/Compiler/2_CompileToHTML/Definition/Box/Word"));
const InlineTranslation_1 = __importDefault(require("documents/parse/Compiler/2_CompileToHTML/Definition/InlineTranslation"));
const Tooltip_1 = __importDefault(require("documents/parse/Compiler/2_CompileToHTML/Definition/Tooltip"));
// import GetSound from 'documents/Parse/Compiler/2_CompileToHTML/Sound'
const omit_empty_1 = __importDefault(require("omit-empty"));
const react_1 = __importDefault(require("react"));
const underscore_1 = __importDefault(require("underscore"));
class WordElement extends react_1.default.Component {
    render() {
        const { id, definition, appendText } = this.props;
        let classes = [];
        let attrs = {};
        if ((0, exists_1.default)(definition)) {
            attrs = (0, omit_empty_1.default)({
                "data-word-has-definition": true,
                // 'data-sound': GetSound(id, editor),
                // 'data-analysis': get_analysis(id, editor),
            });
            /*
              .difficult
              .has-inline-translation
            */
            classes = [
                definition.difficult ? "difficult" : null,
                definition.show_definition_above ? "has-inline-translation" : null,
            ];
            /*
              [data-connected-words]
            */
            if (definition.contains.length > 1) {
                attrs["data-connected-words"] = underscore_1.default.uniq(definition.contains.map((id) => (0, UpdateID_1.getUpdatedID)(id)))
                    .filter((i) => i !== id)
                    .join(",");
            }
        }
        else {
            classes.push("missing");
        }
        const shouldShowInline = definition === null || definition === void 0 ? void 0 : definition.show_definition_above;
        const Tag = "span"; // shouldShowInline ? "ruby" : "span";
        // console.log(definition)
        return [
            (0, jsx_runtime_1.jsx)(Word_1.default, { id: id, definition: definition, hidden: true }, 1),
            (0, jsx_runtime_1.jsx)(Tooltip_1.default, { id: id, definition: definition, hidden: true }, 2),
            (0, jsx_runtime_1.jsxs)(Tag, Object.assign({ className: `word-container ${classes.join(" ")}` }, { children: [(0, jsx_runtime_1.jsx)("span", Object.assign({ className: "word" }, attrs, { id: id, "data-will-have-audio": "true" }, { children: this.props.children })), (0, jsx_runtime_1.jsx)(InlineTranslation_1.default, { definition: definition }), appendText] }), 3),
        ];
    }
}
// const get_analysis = (updatedID, editor) => {
//   const id = getPreviousID(updatedID) || updatedID
//   if (!editor.analysis) return null;
//   const analysis = editor.analysis[id]
//   if (!analysis) return null;
//   // console.log(analysis)
//   return JSON.stringify({
//     BIN_id: analysis.BIN_id,
//     word_class: analysis.word_class,
//     grammatical_tag: analysis.grammatical_tag,
//   })
// }
exports.default = WordElement;
