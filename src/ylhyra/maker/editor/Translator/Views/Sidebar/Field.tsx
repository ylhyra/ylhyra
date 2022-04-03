import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "ylhyra/app/app/store";
import {
  updateDefinitionValue,
  wordsHash,
} from "ylhyra/maker/editor/Translator/actions";

class Field extends React.Component<
  ConnectedProps<typeof connector> & {
    name: string;
    component: Function;
    type: string;
    placeholder?: string;
    id: string;
  }
> {
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
const connector = connect(
  (state: RootState) => ({
    translation: state.editor.translation,
    selected: state.editor.selected,
  }),
  {
    updateDefinitionValue,
  }
);
export default connector(Field);
