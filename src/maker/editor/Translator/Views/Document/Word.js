"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const actions_1 = require("maker/editor/Translator/actions");
const InlineTranslation_1 = __importDefault(require("maker/editor/Translator/Views/Document/InlineTranslation"));
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const styled_components_1 = __importDefault(require("styled-components"));
const underscore_1 = __importDefault(require("underscore"));
const Container = styled_components_1.default.span `
  ${(props) => props.minWidth &&
    `
    min-width: ${props.minWidth}px;
    display: inline-block;
  `}
`;
const Element = styled_components_1.default.span `
  position: relative;
  font-weight: 600;
  & > span {
    cursor: pointer;
    color: ${(props) => (props.difficult_word ? "#1f85ff" : "black")};
    z-index: 2;
    padding: 1px 1px;
    ${"" /* margin: -1px -2px; */}
    border-radius: 2px;
    border: 1px solid transparent;

    ${ /* Sýna bakrunn fyrir hluti sem eru ekki með skýringu */""}
    ${(props) => !props.has_definition &&
    `
      background: #ffe76f;
      border-color: #eccd5c;
    `}

    ${ /* Þegar orð eru valin til að skýra */""}
    ${(props) => props.selected &&
    `
      background: #63dfe1;
      border-color: #54c5e1;
      &:active {
        background: #4fd2d4;
      }
    `}


    ${ /* Hover */""}
    ${(props) => props.hover &&
    !props.selected &&
    `
      background: #fec96d;
      border-color: #eb9f5f;
    `}
  }
  .inline-translation {
    color: ${(props) => (props.translation_always_shown ? "#444" : "#adadad")};

    ${(props) => props.suggested &&
    `
      color: #9ff2d3;
    `}
  }
`;
class Word extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.setMinWidth = (minWidth) => {
            this.setState({
                minWidth: minWidth,
            });
        };
        this.shouldComponentUpdate = (nextProps, nextState) => {
            const { id, translation, selected } = this.props;
            const { words, definitions } = translation;
            // console.log(this.props.suggestions[id])
            // console.log(id)
            if (words[id] !== nextProps.translation.words[id]) {
                return true;
            }
            if (definitions[words[id]] !==
                nextProps.translation.definitions[nextProps.translation.words[id]]) {
                return true;
            }
            if (this.state.hover || nextState.hover) {
                return true;
            }
            if (this.state.minWidth !== nextState.minWidth) {
                return true;
            }
            if (this.props.suggestions !== nextProps.suggestions &&
                this.props.suggestions[id] !== nextProps.suggestions[id]) {
                return true;
            }
            if (underscore_1.default.contains(selected, id) || underscore_1.default.contains(nextProps.selected, id)) {
                return true;
            }
            // console.log(definitions[words[id]])
            // console.warn(nextProps.translation.definitions[nextProps.translation.words[id]])
            return false;
        };
        this.state = { hover: false };
    }
    render() {
        const word = this.props.children;
        const { id, translation, selected, selectWord, deleteWord, suggestions } = this.props;
        const { words, definitions } = translation;
        let definition = null;
        let inline_translation = null;
        let suggested = false;
        // console.log(suggestions)
        if (id in words) {
            definition = definitions[words[id]] || {};
        }
        else if (suggestions && id in suggestions && suggestions[id].length > 0) {
            const { also_part_of_definition } = suggestions[id][0];
            suggested = true;
            if (!also_part_of_definition || !(also_part_of_definition[0] < 0)) {
                definition = suggestions[id][0].definition;
            }
            else if (also_part_of_definition[0] < 0) {
                inline_translation = "←";
            }
        }
        if (definition && !inline_translation) {
            inline_translation =
                definition.inline_translation || definition.meaning || null;
            if (inline_translation &&
                definition.contains &&
                definition.contains[0] !== id) {
                inline_translation = "←";
            }
        }
        return ((0, jsx_runtime_1.jsx)(Container, Object.assign({ minWidth: this.state.minWidth }, { children: (0, jsx_runtime_1.jsxs)(Element, Object.assign({ className: "word", hover: this.state.hover, selected: underscore_1.default.contains(selected, id), difficult_word: (definition === null || definition === void 0 ? void 0 : definition.difficult) || null, translation_always_shown: (definition === null || definition === void 0 ? void 0 : definition.show_definition_above) || null, has_definition: definition && !suggested, suggested: suggested }, { children: [inline_translation && ((0, jsx_runtime_1.jsx)(InlineTranslation_1.default, { text: inline_translation, setMinWidth: this.setMinWidth, marginLeft: 1 })), (0, jsx_runtime_1.jsx)("span", Object.assign({ onMouseDown: (e) => {
                            if (e.button === 2 || e.shiftKey)
                                return false; // Right click & shift
                            // Delete word
                            if (e.ctrlKey || e.metaKey) {
                                deleteWord(id);
                            }
                            // Select word
                            else {
                                selectWord(id, e.altKey);
                            }
                        }, onMouseOver: () => this.setState({ hover: true }), onMouseOut: () => this.setState({ hover: false }) }, { children: word }))] })) })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    translation: state.editor.translation,
    selected: state.editor.selected,
    suggestions: state.editor.suggestions,
}), { selectWord: actions_1.selectWord, deleteWord: actions_1.deleteWord })(Word);
