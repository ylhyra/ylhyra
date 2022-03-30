import {
  updateDefinitionValue,
  wordsHash,
} from "maker/editor/Translator/actions";
import React from "react";
import { connect } from "react-redux";

class Field extends React.Component {
  handleChange = (e) => {
    this.props.updateDefinitionValue({
      name: this.props.name,
      value: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };
  render() {
    const { translation, selected, name } = this.props;
    const definition = translation.definitions[wordsHash(selected)] || {};
    const value = definition[name] || "";
    const Element = this.props.component;
    return (
      <Element
        value={value}
        checked={value}
        name={name}
        type={this.props.type}
        placeholder={this.props.placeholder}
        id={this.props.id}
        autoComplete="off"
        onChange={this.handleChange}
      >
        {this.props.children}
      </Element>
    );
  }
}
export default connect(
  (state) => ({
    translation: state.editor.translation,
    selected: state.editor.selected,
  }),
  {
    updateDefinitionValue,
  }
)(Field);
