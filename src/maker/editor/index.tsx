import { isBrowser } from "app/app/functions/isBrowser";
import { isDev } from "app/app/functions/isDev";
import store from "app/app/store";
import { openEditor } from "maker/editor/actions";
import Header from "maker/editor/Header";
import Inflections from "maker/editor/Inflections";
import LongAudio from "maker/editor/Long_audio";
import Sound from "maker/editor/Short_audio";
import "maker/editor/Style/index.styl";
import Translator from "maker/editor/Translator";

import React from "react";
import { connect } from "react-redux";

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