import { isBrowser } from "modules/isBrowser";
import { isDev } from "modules/isDev";
import React from "react";
import { connect } from "react-redux";
import store, { RootState } from "ylhyra/app/app/store";
import { openEditor } from "ylhyra/content/translationEditor/main/actions";
import Header from "ylhyra/content/translationEditor/main/header";
import Inflections from "ylhyra/content/translationEditor/main/inflections";
import LongAudio from "ylhyra/content/translationEditor/audioSynchronization/frontend";
import Sound from "ylhyra/content/translationEditor/main/shortAudio";
import "ylhyra/content/translationEditor/editorslator/editor/Style/index.styl";
import Translator from "ylhyra/content/translationEditor/main/translator";

class _Editor extends React.PureComponent {
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
const Editor = connect((state: RootState) => ({
  editor: state.editor,
}))(_Editor);

const RenderEditor = () => {
  if (!isDev || !isBrowser) return null;
  if (!store.getState().editor.tokenized?.length > 0) return null;

  return (
    <div>
      <button className="editor-button" onClick={() => openEditor("translate")}>
        Translate
      </button>
      <Editor />
    </div>
  );

  // document
  //   .querySelector("body")
  //   .insertAdjacentHTML(
  //     "beforeend",
  //     '<div id="editor-button-container"></div>'
  //   );
  //
  // let currentDocument = "blabla";
  //
  // ReactDOM.render(
  //   <Provider store={store}>
  //     <div>
  //       <div>
  //         {currentDocument ? (
  //           <button
  //             className="editor-button"
  //             onClick={() => openEditor("translate")}
  //           >
  //             Translate
  //           </button>
  //         ) : (
  //           `No text marked for translation.`
  //         )}
  //         <Editor />
  //       </div>
  //     </div>
  //   </Provider>,
  //   document.querySelector("#editor-button-container")
  // );
};

export default RenderEditor;
