import { closeEditor, openEditor, save } from "maker/editor/actions";
import React from "react";
import { connect } from "react-redux";

class App extends React.Component {
  componentDidMount = () => {
    // MakeSuggestions()
  };
  render() {
    const { editor } = this.props;
    return (
      <div className="header">
        {!editor.isSaved && <button onClick={save}>Save document</button>}
        <button onClick={closeEditor}>Close</button>

        <button onClick={() => openEditor("translate")}>Translate</button>
        <button onClick={() => openEditor("long_audio")}>Long audio</button>
        <button onClick={() => openEditor("sound")}>Sound</button>
        {/* <button onClick={()=>openEditor('inflections')}>Inflections</button> */}
      </div>
    );
  }
}

export default connect(
  (state) => ({
    editor: state.editor,
  }),
  {}
)(App);
