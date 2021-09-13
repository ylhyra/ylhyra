import "maker/editor/Style/index2.styl";

import React from "react";
import ReactDOM from "react-dom";
import { connect, Provider } from "react-redux";
import store from "app/app/store";
import Translator from "maker/editor/Translator";
import Header from "maker/editor/Header";
import LongAudio from "maker/editor/Long_audio";
import Inflections from "maker/editor/Inflections";
import Sound from "maker/editor/Short_audio";
import { openEditor } from "maker/editor/actions";

@connect((state) => ({
  editor: state.editor,
}))
class Editor extends React.PureComponent {
  // componentDidMount = () => {
  //
  // }
  render() {
    if (this.props.editor.open) {
      let View = Translator;
      if (this.props.editor.open === "sound") {
        View = Sound;
      } else if (this.props.editor.open === "long_audio") {
        View = LongAudio;
      } else if (this.props.editor.open === "inflections") {
        View = Inflections;
      }
      return (
        <div id="editor">
          <Header />
          <View />
        </div>
      );
    } else {
      return null;
    }
  }
}

const RenderEditor = () => {
  document
    .querySelector("body")
    .insertAdjacentHTML(
      "beforeend",
      '<div id="editor-button-container"></div>'
    );
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <div>
          {currentDocument ? (
            <button
              className="editor-button"
              onClick={() => openEditor("translate")}
            >
              Translate
            </button>
          ) : (
            `No text marked for translation.`
          )}
          <Editor />
        </div>
      </div>
    </Provider>,
    document.querySelector("#editor-button-container")
  );
};

export default RenderEditor;

RenderEditor();
