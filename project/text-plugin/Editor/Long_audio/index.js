import { connect } from 'react-redux'
import { synchronize } from 'Editor/Long_audio/Synchronize'
import React from 'react'
import store from 'App/store'
// import Upload from './Upload'
import { findAudioSections } from './actions'

class LongAudio extends React.Component {
  componentDidMount = () => {
    // this.load()
    findAudioSections()
  }
  // componentDidUpdate(prevProps, prevState) {
  //   this.load()
  // }
  // load = () => {
  //   if (!this.props.long_audio.areSectionsUpdated) {
  //     findAudioSections()
  //   }
  // }
  render() {
    const { audio, editor, match } = this.props
    // console.log(audio.sections)
    return (
      <div className="center">

        {/* <button onClick={()=>synchronize(section.hash)}>Synchronize</button> (can take some time, please be patient after clicking) */}

      </div>
    )
  }
}

export default connect(
  state => ({
    long_audio: state.editor.long_audio,
  })
)(LongAudio)
