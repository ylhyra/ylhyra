"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const store_1 = __importDefault(require("app/app/store"));
const actions_1 = require("maker/editor/Translator/actions");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
class Suggestions extends react_1.default.Component {
    render() {
        const { updateDefinition, list } = this.props;
        let selected = this.props.selected;
        const suggestions = this.props.suggestions[selected[0]];
        if (!suggestions || !Array.isArray(suggestions))
            return null;
        // const { also_part_of_definition } = suggestion
        //
        // let text = list.words[selected[0]].text
        //
        // // TEMP
        // if(also_part_of_definition) {
        //   const index = list.arrayOfAllWordIDs.indexOf(suggestion.item_id)
        //   selected = also_part_of_definition.map(relative_movement => {
        //     return list.arrayOfAllWordIDs[index + relative_movement]
        //   })
        //   text = selected.map(id => {
        //     return list.words[id].text
        //   }).join(' ')
        // }
        //
        // console.log(suggestion)
        // suggestion.definition_hash = translation.words[selected[0]]
        return ((0, jsx_runtime_1.jsxs)("section", Object.assign({ className: "ylhyra-suggestions" }, { children: [(0, jsx_runtime_1.jsx)("h4", { children: "Suggestions" }), (0, jsx_runtime_1.jsx)("ul", { children: suggestions.map((suggestion, index) => {
                        return ((0, jsx_runtime_1.jsx)("li", Object.assign({ onClick: () => {
                                selected = this.props.selected;
                                const { also_part_of_definition } = suggestion;
                                // let text = list.words[selected[0]].text
                                // TEMP
                                if (also_part_of_definition) {
                                    const index = list.arrayOfAllWordIDs.indexOf(suggestion.item_id);
                                    selected = also_part_of_definition.map((relative_movement) => {
                                        return list.arrayOfAllWordIDs[index + relative_movement];
                                    });
                                    // text = selected.map(id => {
                                    //   return list.words[id].text
                                    // }).join(' ')
                                }
                                store_1.default.dispatch({
                                    type: "SELECT_WORD",
                                    contains: selected,
                                    arrayOfAllWordIDs: store_1.default.getState().editor.list.arrayOfAllWordIDs,
                                });
                                updateDefinition({
                                    definition: suggestion.definition,
                                    selected: selected,
                                });
                            } }, { children: (0, jsx_runtime_1.jsx)("span", { children: suggestion.definition.meaning }) }), index));
                    }) })] })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    translation: state.editor.translation,
    suggestions: state.editor.suggestions,
    selected: state.editor.selected,
    list: state.editor.list,
}), {
    updateDefinition: actions_1.updateDefinition,
})(Suggestions);
