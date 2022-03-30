"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItalicsAndBold = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
// import { ItalicsAndBold } from 'Parse/Compiler/2_CompileToHTML/Definition/Tooltip'
class InlineTranslation extends react_1.default.PureComponent {
    constructor() {
        super(...arguments);
        this.timer = null;
        this.componentDidMount = () => {
            this.updateWidth();
            /* Update width again in case the document was too slow to render */
            this.timer = setTimeout(() => {
                this.updateWidth();
            }, 1200);
        };
        this.componentDidUpdate = (prevProps) => {
            if (prevProps.text !== this.props.text) {
                this.updateWidth();
            }
        };
        this.updateWidth = () => {
            const DOMNode = react_dom_1.default.findDOMNode(this);
            const rectangle = DOMNode.getBoundingClientRect();
            const width = Math.floor(rectangle.width);
            this.props.setMinWidth(width + 10);
            // console.log({width,text:this.props.text})
        };
        this.componentWillUnmount = () => {
            this.timer && clearTimeout(this.timer);
        };
    }
    render() {
        return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "inline-translation" }, { children: (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: {
                    __html: (0, exports.ItalicsAndBold)(this.props.text),
                } }) })));
    }
}
exports.default = InlineTranslation;
const ItalicsAndBold = (input) => {
    return input
        .replace(/\*\*([^ ].+?[^ ])\*\*/g, "<b>$1</b>")
        .replace(/\*([^ ].+?[^ ])\*/g, "<i>$1</i>")
        .replace(/_([^ ].+?[^ ])_/g, "<i>$1</i>");
};
exports.ItalicsAndBold = ItalicsAndBold;
