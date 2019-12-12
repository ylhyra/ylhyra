import { connect } from 'react-redux'
import { synchronize } from 'Editor/Long_audio/Synchronize'
import React from 'react'
import store from 'App/store'
// import Upload from './Upload'
import findAudioSections from './actions'

class LongAudio extends React.Component {
  componentDidMount = () => {
    findAudioSections()
  }
  render() {
    const { long_audio } = this.props
    const { filename, xml, sync } = long_audio
    if (!filename) return 'No audio sections';
    return (
      <div className="xcenter">
        {long_audio.filename} &nbsp;
        {sync ? 'Synced!' : <div>
          <button onClick={synchronize}>Synchronize</button> (can take some time, please be patient after clicking)
        </div>}
      </div>
    )
  }
}

export default connect(
  state => ({
    long_audio: state.editor.long_audio,
  })
)(LongAudio)
