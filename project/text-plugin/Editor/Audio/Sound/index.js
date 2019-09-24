import { connect } from 'react-redux'
import tokenize from 'Editor/2-Parse/2.2-Tokenize'
import { synchronize } from 'Editor/4-Audio/Synchronize'
import React from 'react'
import store from 'App/store'
import { findSoundBites } from './actions'
import Recorder from './Recorder'

class Sounds extends React.Component {
  componentDidMount = () => {
    this.load()
  }
  componentDidUpdate(prevProps, prevState) {
    this.load()
  }
  load = () => {
    if (!this.props.editor.parsed) {
      tokenize()
    } else if (!this.props.audio.areSoundsUpdated) {
      findSoundBites()
    }
  }
  render() {
    const { audio, editor, match } = this.props
    if (!editor.input) {
      return null
    }
    if (!editor.parsed) {
      return 'Loading...'
    }
    return (
      <div className="center">
        <table>
          <tbody>
            {audio.soundList && (audio.soundList.map((sound,index) => (
              <tr key={index}>
                <td>{sound}</td>
                <td>
                  {audio.sounds[sound]?.map((file, index2) => (
                    <div key={index2}>
                      <audio src={file} controls/>
                    </div>
                  ))}
                </td>
                <td>
                  <Recorder word={sound}/>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default connect(
  state => ({
    audio: state.editor.audio,
    editor: state.editor,
  })
)(Sounds)
