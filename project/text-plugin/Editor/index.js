import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import style from 'Editor/Style/index.styl'
import Translator from 'Editor/Translator'
import root from 'react-shadow'
let timer

console.log(style)

@connect(state => ({
  editor: state.editor,
}))
class Editor extends React.PureComponent {
  render() {
    if (true || this.props.editor.open) {
      return <root.div className="quote">
        <style type="text/css">{style}</style>
        <div id="editor">
          <Translator/>
        </div>
      </root.div>
    } else {
      return null
    }
  }
}
console.log(style)

const Render = (parsed) => {
  $('#catlinks').append('<div id="editor-button-container">asdf</div>')
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
