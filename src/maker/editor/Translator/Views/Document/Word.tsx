import { deleteWord, selectWord } from "maker/editor/Translator/actions";
import InlineTranslation from "maker/editor/Translator/Views/Document/InlineTranslation";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import _ from "underscore";

const Container = styled.span`
  ${(props) =>
    props.minWidth &&
    `
    min-width: ${props.minWidth}px;
    display: inline-block;
  `}
`;

const Element = styled.span`
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

    ${/* Sýna bakrunn fyrir hluti sem eru ekki með skýringu */ ""}
    ${(props) =>
      !props.has_definition &&
      `
      background: #ffe76f;
      border-color: #eccd5c;
    `}

    ${/* Þegar orð eru valin til að skýra */ ""}
    ${(props) =>
      props.selected &&
      `
      background: #63dfe1;
      border-color: #54c5e1;
      &:active {
        background: #4fd2d4;
      }
    `}


    ${/* Hover */ ""}
    ${(props) =>
      props.hover &&
      !props.selected &&
      `
      background: #fec96d;
      border-color: #eb9f5f;
    `}
  }
  .inline-translation {
    color: ${(props) => (props.translation_always_shown ? "#444" : "#adadad")};

    ${(props) =>
      props.suggested &&
      `
      color: #9ff2d3;
    `}
  }
`;

class Word extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hover: false };
  }
  setMinWidth = (minWidth) => {
    this.setState({
      minWidth: minWidth,
    });
  };
  shouldComponentUpdate = (nextProps, nextState) => {
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
    if (
      this.props.suggestions !== nextProps.suggestions &&
      this.props.suggestions[id] !== nextProps.suggestions[id]
    ) {
      return true;
    }
    if (_.contains(selected, id) || _.contains(nextProps.selected, id)) {
      return true;
    }
    // console.log(definitions[words[id]])
    // console.warn(nextProps.translation.definitions[nextProps.translation.words[id]])
    return false;
  };
  render() {
    const word = this.props.children;
    const { id, translation, selected, selectWord, deleteWord, suggestions } =
      this.props;
    const { words, definitions } = translation;

    let definition = null;
    let inline_translation = null;
    let suggested = false;

    // console.log(suggestions)

    if (id in words) {
      definition = definitions[words[id]] || {};
    } else if (suggestions && id in suggestions && suggestions[id].length > 0) {
      const { also_part_of_definition } = suggestions[id][0];
      suggested = true;
      if (!also_part_of_definition || !(also_part_of_definition[0] < 0)) {
        definition = suggestions[id][0].definition;
      } else if (also_part_of_definition[0] < 0) {
        inline_translation = "←";
      }
    }

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
      <Container minWidth={this.state.minWidth}>
        <Element
          className="word"
          hover={this.state.hover}
          selected={_.contains(selected, id)}
          difficult_word={definition?.difficult || null}
          translation_always_shown={definition?.show_definition_above || null}
          has_definition={definition && !suggested}
          suggested={suggested}
        >
          {inline_translation && (
            <InlineTranslation
              text={inline_translation}
              setMinWidth={this.setMinWidth}
              marginLeft={1}
            />
          )}

          {/* {definition &&
            <Tooltip
              visible={this.state.hover}
              definition={definition}/>
          } */}

          <span
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
        </Element>
      </Container>
    );
  }
}

export default connect(
  (state) => ({
    translation: state.editor.translation,
    selected: state.editor.selected,
    suggestions: state.editor.suggestions,
  }),
  { selectWord, deleteWord }
)(Word);
