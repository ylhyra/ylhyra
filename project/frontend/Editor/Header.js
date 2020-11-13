import { save, closeEditor, openEditor } from 'Editor/actions'
import store from 'App/store'
// import MakeSuggestions from 'Editor/Suggestions'

import React from 'react'
import { connect } from 'react-redux'
class App extends React.Component {
  componentDidMount = () => {
    // MakeSuggestions()
  }
  render() {
    const {editor} = this.props
    const { isSaved } = this.props.editor
    const { location } = this.props
    return (
      <div className="header">
        {!editor.isSaved && <button onClick={save}>Save document</button>}
        <button onClick={closeEditor}>Close</button>

        <button onClick={()=>openEditor('translate')}>Translate</button>
        <button onClick={()=>openEditor('long_audio')}>Long audio</button>
        <button onClick={()=>openEditor('sound')}>Sound</button>
        {/* <button onClick={()=>openEditor('inflections')}>Inflections</button> */}
      </div>
    );
  }
}

export default connect(state => ({
  editor: state.editor,
}), {
})(App)
