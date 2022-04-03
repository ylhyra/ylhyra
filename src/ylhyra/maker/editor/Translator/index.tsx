import React from "react";
import { connect } from "react-redux";
import {
  applySuggestions,
  MakeSuggestions,
} from "ylhyra/maker/editor/Suggestions";
import Suggestions from "ylhyra/maker/editor/Suggestions/Views/List";
import { clearSelection } from "ylhyra/maker/editor/Translator/actions";
import SentenceTranslation from "ylhyra/maker/editor/Translator/Views/Document/SentenceTranslation";
import Word from "ylhyra/maker/editor/Translator/Views/Document/Word";
import WordSidebar, {
  isMacintosh,
} from "ylhyra/maker/editor/Translator/Views/Sidebar/Sidebar";

class TranslatingEditor extends React.Component {
  componentDidMount() {
    window.addEventListener("keydown", this.checkKey);
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.checkKey);
  }
  checkKey = (e) => {
    // Escape
    if (e.keyCode === 27) {
      this.props.clearSelection();
    }
  };
  render() {
    const { editor, selected } = this.props;
    return (
      <div className="translator-container">
        <div className="translator-content">
          <div>
            <div className="translator-header">
              <div>
                <label>
                  <b>Shortcuts:</b>
                </label>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <kbd>Click</kbd>
                      </td>
                      <td>Select word</td>
                    </tr>
                    <tr>
                      <td>
                        <kbd>Alt</kbd>+<kbd>Click</kbd>
                      </td>
                      <td>Add word</td>
                    </tr>
                    <tr>
                      <td>
                        <kbd>{isMacintosh() ? "Cmd" : "Ctrl"}</kbd>+
                        <kbd>Click</kbd>
                      </td>
                      <td>Delete word</td>
                    </tr>
                    <tr>
                      <td colSpan="2"></td>
                    </tr>
                    <tr>
                      <td>
                        <kbd>Enter</kbd>
                      </td>
                      <td>Next word</td>
                    </tr>
                    <tr>
                      <td>
                        <kbd>Shift</kbd>+<kbd>Enter</kbd>
                      </td>
                      <td>Add next word</td>
                    </tr>
                    <tr>
                      <td>
                        <kbd>Alt+Enter</kbd>
                      </td>
                      <td>Previous word</td>
                    </tr>
                    <tr>
                      <td>
                        <kbd>Alt+Shift</kbd>+<kbd>Enter</kbd>
                      </td>
                      <td>Add previous word</td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <div>
                  <button onClick={MakeSuggestions}>Get suggestions</button>
                  <div>
                    <small className="editor-hide sysop-hide">
                      Note: Machine translations are currently only available
                      for verified editors
                    </small>
                  </div>
                  <button onClick={applySuggestions}>Apply suggestions</button>
                </div>
              </div>
            </div>

            {editor.tokenized.map((paragraph, index) => (
              // Paragraph
              <div className="paragraph" key={index}>
                {paragraph.sentences.map((sentence) => (
                  // Sentence
                  <div className="sentence-container" key={sentence.id}>
                    <div>
                      {sentence.words.map((word) => {
                        // Word
                        if (typeof word === "string") {
                          return word;
                        } else {
                          return (
                            <Word id={word.id} key={word.id}>
                              {word.text}
                            </Word>
                          );
                        }
                      })}
                    </div>
                    <SentenceTranslation id={sentence.id} />
                  </div>
                ))}
              </div>
            ))}

            {editor.parsed &&
              editor.tokenized.length === 0 &&
              `
              No text to translate. You can wrap paragraphs or phrases in <translate/> tags.
            `}
          </div>
        </div>

        <div className="sidebar form">
          <div className="form">
            {selected.length > 0 && <Suggestions />}
            {selected.length > 0 && <WordSidebar />}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state: RootState) => ({
    editor: state.editor,
    translation: state.editor.translation,
    selected: state.editor.selected,
  }),
  {
    clearSelection,
  }
)(TranslatingEditor);
