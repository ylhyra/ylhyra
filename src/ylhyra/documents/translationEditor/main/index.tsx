import { isBrowser } from "modules/isBrowser";
import { isDev } from "modules/isDev";
import { Jsx } from "modules/typescript/jsx";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import store, { RootState } from "ylhyra/app/app/store";
import LongAudio from "ylhyra/documents/translationEditor/audioSynchronization/frontend";
import { openEditor } from "ylhyra/documents/translationEditor/main/actions";
import Header from "ylhyra/documents/translationEditor/main/header";
import "ylhyra/documents/translationEditor/main/style/index.styl";
import Translator from "ylhyra/documents/translationEditor/main/translator";

class _Editor extends React.PureComponent<ConnectedProps<typeof connector>> {
  // componentDidMount = () => {
  //
  // }
  render() {
    if (this.props.editor.open) {
      let View: Jsx = Translator;
      // if (this.props.editor.open === "sound") {
      //   View = Sound;
      // } else
      if (this.props.editor.open === "long_audio") {
        View = LongAudio;
      }
      //   else if (this.props.editor.open === "inflections") {
      //   View = Inflections;
      // }
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

const connector = connect((state: RootState) => ({
  editor: state.editor,
}));
const Editor = connector(_Editor);

const RenderEditor = () => {
  if (!isDev || !isBrowser) return null;
  if (
    !store.getState().editor.tokenized ||
    store.getState().editor.tokenized.length === 0
  )
    return null;

  return (
    <div>
      <button className="editor-button" onClick={() => openEditor("translate")}>
        Translate
      </button>
      <Editor />
    </div>
  );
};

export default RenderEditor;
