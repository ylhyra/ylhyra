import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "ylhyra/app/app/store";
import { closeEditor, openEditor, save } from "ylhyra/content/translator/editor/actions";

class App extends React.Component<ConnectedProps<typeof connector>> {
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
const connector = connect((state: RootState) => ({
  editor: state.editor,
}));
export default connector(App);
