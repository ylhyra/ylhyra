"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
class Inflections extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {};
        this.componentDidMount = () => {
            // const { analysis, list } = this.props.editor
            // let id_to_possible_values = {}
            // list.arrayOfAllWordIDs.forEachAsync(async (id) => {
            //   await new Promise(async resolve => {
            //     // console.log(analysis[id])
            //     list.words[id].text
            //     const rows = (await axios.post(`/api/inflection/search`, {
            //       word: list.words[id].text
            //     })).data
            //     id_to_possible_values[id] = rows
            //     resolve()
            //   })
            // })
            // this.setState({
            //   id_to_possible_values
            // })
        };
    }
    render() {
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "" }, { children: ["Uncertain:", (0, jsx_runtime_1.jsx)("hr", {}), "Certain:"] })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    editor: state.editor,
}), {})(Inflections);
