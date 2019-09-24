import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
// require('Editor/Style/index.styl')
import Translator from 'Editor/Translator'
const title = mw.config.get('wgTitle')
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
  $('#firstHeading').prepend('<div id="editor-button-container"></div>')
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <div>
          <button className="editor-button" onClick={start}>
            Translate
          </button>
          <button className="editor-button" onClick={window.showRaw}>
            Show raw
          </button>
          <Editor/>
        </div>
      </div>
    </Provider>,
    document.querySelector('#editor-button-container')
  )
}
export default Render

const start = () => {
  store.dispatch({
    type: 'OPEN_EDITOR',
  })
}
