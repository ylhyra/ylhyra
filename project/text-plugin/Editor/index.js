import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
// require('text-plugin/Editor/Style/index.styl')
import Translator from 'Editor/Translator'
import Header from 'Editor/Header'
import LongAudio from 'Editor/Long_audio'
import Sound from 'Editor/Short_audio'
import { openEditor, purgeCurrentPage } from './actions'
let timer

@connect(state => ({
  editor: state.editor,
}))
class Editor extends React.PureComponent {
  render() {
    if (this.props.editor.open) {
      let View = Translator
      if (this.props.editor.open === 'sound') {
        View = Sound
      } else if (this.props.editor.open === 'long_audio') {
        View = LongAudio
      }
      return <div id="editor">
          <Header/>
          <View/>
        </div>
    } else {
      return null
    }
  }
}

const RenderEditor = ({currentDocument}) => {
  // console.log(currentDocument)
  $('#content').append('<div id="editor-button-container"></div>')
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <div>
          <button className="editor-button" onClick={purgeCurrentPage}>
            Purge cache
          </button>
          <button className="editor-button" onClick={window.showRaw}>
            Show raw
          </button>

          {currentDocument ?
            <button className="editor-button" onClick={()=>openEditor('translate')}>
              Translate
            </button>
            : `No text marked for translation.`
          }
          <Editor/>
        </div>
      </div>
    </Provider>,
    document.querySelector('#editor-button-container')
  )
}

export default RenderEditor
