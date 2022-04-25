import { c } from "modules/noUndefinedInTemplateLiteral";
import { Jsx } from "modules/typescript/jsx";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import _ from "underscore";
import { RootState } from "ylhyra/app/app/store";
import {
  deleteWord,
  selectWord,
} from "ylhyra/documents/translationEditor/main/translator/actions";
import InlineTranslation from "ylhyra/documents/translationEditor/main/translator/Views/Document/InlineTranslation";

type Props = ConnectedProps<typeof connector> & { id: string; children: Jsx };
export class _Word extends React.Component<Props> {
  state: {
    hover: Boolean;
    minWidth: number;
  } = {
    hover: false,
    minWidth: 0,
  };
  setMinWidth = (minWidth: Number) => {
    this.setState({
      minWidth: minWidth,
    });
  };
  shouldComponentUpdate = (nextProps: Props, nextState: _Word["state"]) => {
    const { id, translation, selected } = this.props;
    const { words, definitions } = translation;
    // console.log(this.props.suggestions[id])
    // console.log(id)

    if (words[id] !== nextProps.translation.words[id]) {
      return true;
    }
    if (
      definitions[words[id]] !==
      nextProps.translation.definitions[nextProps.translation.words[id]]
    ) {
      return true;
    }
    if (this.state.hover || nextState.hover) {
      return true;
    }
    if (this.state.minWidth !== nextState.minWidth) {
      return true;
    }
    // if (
    //   this.props.suggestions !== nextProps.suggestions &&
    //   this.props.suggestions[id] !== nextProps.suggestions[id]
    // ) {
    //   return true;
    // }
    if (_.contains(selected, id) || _.contains(nextProps.selected, id)) {
      return true;
    }
    // console.log(definitions[words[id]])
    // console.warn(nextProps.translation.definitions[nextProps.translation.words[id]])
    return false;
  };
  render() {
    const word = this.props.children;
    const {
      id,
      translation,
      selected,
      selectWord,
      deleteWord /*suggestions*/,
    } = this.props;
    const { words, definitions } = translation;

    let definition = null;
    let inline_translation = null;
    // let suggested = false;

    // console.log(suggestions)

    if (id in words) {
      definition = definitions[words[id]] || {};
    }
    // else if (suggestions && id in suggestions && suggestions[id].length > 0) {
    //   const { also_part_of_definition } = suggestions[id][0];
    //   suggested = true;
    //   if (!also_part_of_definition || !(also_part_of_definition[0] < 0)) {
    //     definition = suggestions[id][0].definition;
    //   } else if (also_part_of_definition[0] < 0) {
    //     inline_translation = "←";
    //   }
    // }

    if (definition && !inline_translation) {
      inline_translation =
        definition.inline_translation || definition.meaning || null;
      if (
        inline_translation &&
        definition.contains &&
        definition.contains[0] !== id
      ) {
        inline_translation = "←";
      }
    }

    return (
      <span
        className="word-outer-container"
        style={{ minWidth: this.state.minWidth }}
      >
        <span className="word-container">
          {inline_translation && (
            <InlineTranslation
              text={inline_translation}
              setMinWidth={this.setMinWidth}
              show_definition_above={definition?.show_definition_above}
            />
          )}

          {/* {definition &&
            <Tooltip
              visible={this.state.hover}
              definition={definition}/>
          } */}

          <span
            className={c`
              word
              ${this.state.hover && "hover"}
              ${_.contains(selected, id) && "selected"}
              ${(definition?.difficult || null) && "difficult_word"}
              ${definition /*&& !suggested*/ && "has_definition"}
            `}
            onMouseDown={(e) => {
              if (e.button === 2 || e.shiftKey) return false; // Right click & shift
              // Delete word
              if (e.ctrlKey || e.metaKey) {
                deleteWord(id);
              }
              // Select word
              else {
                selectWord(id, e.altKey);
              }
            }}
            onMouseOver={() => this.setState({ hover: true })}
            onMouseOut={() => this.setState({ hover: false })}
          >
            {word}
          </span>
        </span>
      </span>
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    translation: state.editor.translation,
    selected: state.editor.selected,
    // suggestions: state.editor.suggestions,
  }),
  { selectWord, deleteWord }
);
export default connector(_Word);
