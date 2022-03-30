import React from "react";
import { connect } from "react-redux";
import { updateDefinition } from "maker/editor/Translator/actions";
import store from "app/app/store";

class Suggestions extends React.Component {
  render() {
    const { updateDefinition, list } = this.props;
    let selected = this.props.selected;

    const suggestions = this.props.suggestions[selected[0]];
    if (!suggestions || !Array.isArray(suggestions)) return null;

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

    return (
      <section className="ylhyra-suggestions">
        <h4>Suggestions</h4>
        <ul>
          {suggestions.map((suggestion, index) => {
            return (
              <li
                key={index}
                onClick={() => {
                  selected = this.props.selected;
                  const { also_part_of_definition } = suggestion;
                  // let text = list.words[selected[0]].text
                  // TEMP
                  if (also_part_of_definition) {
                    const index = list.arrayOfAllWordIDs.indexOf(
                      suggestion.item_id
                    );
                    selected = also_part_of_definition.map(
                      (relative_movement) => {
                        return list.arrayOfAllWordIDs[
                          index + relative_movement
                        ];
                      }
                    );
                    // text = selected.map(id => {
                    //   return list.words[id].text
                    // }).join(' ')
                  }

                  store.dispatch({
                    type: "SELECT_WORD",
                    contains: selected,
                    arrayOfAllWordIDs:
                      store.getState().editor.list.arrayOfAllWordIDs,
                  });
                  updateDefinition({
                    definition: suggestion.definition,
                    selected: selected,
                  });
                }}
              >
                {/* <b>{text}</b> &mdash;&nbsp; */}
                <span>{suggestion.definition.meaning}</span>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }
}

export default connect(
  (state) => ({
    translation: state.editor.translation,
    suggestions: state.editor.suggestions,
    selected: state.editor.selected,
    list: state.editor.list,
  }),
  {
    updateDefinition,
  }
)(Suggestions);
