import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import style from 'Editor/Style/index.styl'
import Translator from 'Editor/Translator'
import { openEditor, purgeCurrentPage } from './actions'
let timer

@connect(state => ({
  editor: state.editor,
}))
class Editor extends React.PureComponent {
  render() {
    if (this.props.editor.open) {
      return <div id="editor">
          <Translator/>
        </div>
    } else {
      return null
    }
  }
}

const Render = (parsed) => {
  $('#catlinks').append('<div id="editor-button-container"></div>')
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
          <button className="editor-button" onClick={openEditor}>
            Translate
          </button>
          <Editor/>
        </div>
      </div>
    </Provider>,
    document.querySelector('#editor-button-container')
  )
}

export default Render
