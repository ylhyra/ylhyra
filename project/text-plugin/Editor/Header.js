import { save, closeEditor, openEditor } from 'Editor/actions'
import store from 'App/store'

import React from 'react'
import { connect } from 'react-redux'
class App extends React.Component {
  render() {
    const {editor} = this.props
    const { isSaved } = this.props.editor
    const { location } = this.props
    return (
      <div className="header">
        {!editor.isSaved && <button onClick={save}>Save document</button>}
        <br/>
        <button onClick={closeEditor}>Close</button>

        <button onClick={openEditor}>Translate</button>
        <button onClick={()=>{store.dispatch({
          type: 'OPEN_SOUND',
        })}}>Sound</button>

        {/* <div className="small">
          <div>
            <Button onClick={()=>saveEditor('/documents')} to="#">&larr; Back</Button>
          </div>
        </div>
        <div>
          <div className="steps">
            <NavLink className="step" to={`/editor/${this.props.match.params.document_id}/edit`} isActive={()=>isActive(location, 'edit')}>
              <span>Step 1</span>
              <span>Input</span>
            </NavLink>
            <div className="arrow"/>
            <NavLink className="step" to={`/editor/${this.props.match.params.document_id}/translate`} isActive={()=>isActive(location, 'translate')}>
              <span>Step 2</span>
              <span>Translate</span>
            </NavLink>
            <div className="arrow"/>
            <NavLink className="step" to={`/editor/${this.props.match.params.document_id}/audio`} isActive={()=>isActive(location, 'audio')}>
              <span>Step 3</span>
              <span>Audio sections</span>
            </NavLink>
            <div className="arrow"/>
            <NavLink className="step" to={`/editor/${this.props.match.params.document_id}/sound`} isActive={()=>isActive(location, 'sound')}>
              <span>Step 4</span>
              <span>Soundbites</span>
            </NavLink>
            <div className="arrow"/>
            <NavLink  className="step"to={`/editor/${this.props.match.params.document_id}/preview`} isActive={()=>isActive(location, 'preview')}>
              <span>Step 5</span>
              <span>Preview</span>
            </NavLink>
            <div className="arrow"/>
            <NavLink className="step" to={`/editor/${this.props.match.params.document_id}/publish`} isActive={()=>isActive(location, 'publish')}>
              <span>Step 6</span>
              <span>Publish</span>
            </NavLink>
          </div>
        </div> */}
      </div>
    );
  }
}

export default connect(state => ({
  editor: state.editor,
}), {
})(App)
