import { connect } from 'react-redux'
import { clearSelection } from './actions'
import { request as requestSuggestion, applySuggestions } from 'Editor/Suggestions'
import React from 'react'
import SentenceTranslation from 'Editor/Translator/Views/Document/SentenceTranslation'
import Word from 'Editor/Translator/Views/Document/Word'
import WordSidebar, { isMacintosh } from 'Editor/Translator/Views/Sidebar/Sidebar'
import Suggestions from 'Editor/Suggestions/List'
import store from 'App/store'

class TranslatingEditor extends React.Component {
  UNSAFE_componentWillMount() {
    window.addEventListener('keydown', this.checkKey);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.checkKey);
  }
  checkKey = (e) => {
    // Escape
    if (e.keyCode === 27) {
      this.props.clearSelection()
    }
  }
  render() {
    const { editor, selected } = this.props
    const ready = new Boolean(editor.tokenized)
    return (
      <div className="translator-container">
        <div className="translator-content">
          <div>
            <div className="translator-header">
              <div>
                <label><b>Shortcuts:</b></label>
                <table>
                  <tbody>
                    <tr><td><kbd>Click</kbd></td><td>Select word</td></tr>
                    <tr><td><kbd>Alt</kbd>+<kbd>Click</kbd></td><td>Add word</td></tr>
                    <tr><td><kbd>{isMacintosh() ? 'Cmd' : 'Ctrl'}</kbd>+<kbd>Click</kbd></td><td>Delete word</td></tr>
                    <tr><td colSpan="2"></td></tr>
                    <tr><td><kbd>Enter</kbd></td><td>Next word</td></tr>
                    <tr><td><kbd>Shift</kbd>+<kbd>Enter</kbd></td><td>Add next word</td></tr>
                    <tr><td><kbd>Alt+Enter</kbd></td><td>Previous word</td></tr>
                    <tr><td><kbd>Alt+Shift</kbd>+<kbd>Enter</kbd></td><td>Add previous word</td></tr>
                  </tbody>
                </table>
                <br/>
                <div>
                  <button onClick={requestSuggestion}>Get suggestions</button>
                  <button onClick={applySuggestions}>Apply suggestions</button>
                </div>
              </div>
            </div>

            {editor.tokenized.map((paragraph, index) => (
              // Paragraph
              <div className="paragraph" key={index}>
                {paragraph.sentences.map(sentence => (
                  // Sentence
                  <div className="sentence-container" key={sentence.id}>
                    <div>
                      {sentence.words.map(word => {
                        // Word
                        if(typeof word === 'string') {
                          return word
                        } else {
                          return <Word id={word.id} key={word.id}>{word.text}</Word>
                        }
                      })}
                    </div>
                    <SentenceTranslation id={sentence.id}/>
                  </div>
                ))}
              </div>
            ))}

            {editor.parsed && editor.tokenized.length === 0 && `
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
    )
  }
}


export default connect(
  state => ({
    editor: state.editor,
    translation: state.editor.translation,
    selected: state.editor.selected,
  }), {
    clearSelection,
  }
)(TranslatingEditor)
