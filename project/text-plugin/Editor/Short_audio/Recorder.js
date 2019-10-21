import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { ReactMic } from 'react-mic'
import Sound from 'react-sound'
import axios from 'axios'
import store from 'App/store'
import { findSoundBites } from './actions'
// import { saveEditor } from 'Editor/actions'
import { send } from 'Editor/web-socket'
var FormData = require('form-data');

export default class RecorderElement extends React.Component {
  state = {
    recording: false,
    word: null,
    remaining: [],
    blob: null,
  }
  start = () => {
    this.setState({
      recording: true,
      saved: false,
      blob: false,
    })
  }
  stop = () => {
    this.setState({
      recording: false,
    })
  }
  recordingDone = (blob) => {
    blob && this.setState({
      blob,
      saved: false,
    })
  }
  save = () => {
    var reader = new window.FileReader()
    var api = new mw.Api();
    reader.readAsDataURL(this.state.blob.blob)
    reader.onloadend = async () => {
      // send({
      //   type: 'RECORDER',
      //   word: this.props.word,
      //   speaker: mw.config.get('wgUserName'),
      //   base64_data,
      // })
      this.setState({
        saved: true,
        blob: null,
      })
      const filename = (await axios.post('/api/recorder/save', {
        type: 'RECORDER',
        word: this.props.word,
        speaker: mw.config.get('wgUserName'),
        base64_data: reader.result.match(/^data:.+\/(.+);base64,(.*)$/)[2],
      })).data
      console.log(filename)
      //
      // store.dispatch({
      //   type: 'SOUND_BITE_FILE',
      //   word: this.props.word,
      //   filename: filename,
      // })
      // saveEditor()
    }
  }
  cancel = () => {
    this.setState({
      saved: true,
      blob: null,
    })
  }
  render() {
    if (!this.props.word) return null
    return (
      <div>
        <div onMouseDown={this.start} onMouseUp={this.stop} className={`recorder ${this.state.recording ? 'recording': ''}`}>
          Record
        </div>

        {this.state.saved === false && (
          <ReactMic
            record={this.state.recording}
            onStop={this.recordingDone}
            mimeType="audio/wav"
            strokeColor="#cb0d51"
            backgroundColor="#ffffff"
          />
        )}

        {this.state.blob && this.state.blob.blobURL && !this.state.recording && (<div>
          <Sound
            url={this.state.blob.blobURL}
            playStatus={Sound.status.PLAYING}
            loop={true}
            // onLoading={this.handleSongLoading}
            // onPlaying={this.handleSongPlaying}
            // onFinishedPlaying={()=>this.setState({blob: { ...this.state.blob, blobURL: null }})}
          />
          <div onClick={this.save} className="recorder">
            Save
          </div>
          <div onClick={this.cancel} className="recorder">
            Cancel
          </div>
        </div>
        )}
      </div>
    )
  }
}







// componentWillMount() {
//   window.addEventListener('keydown', this.keyDown);
//   window.addEventListener('keyup', this.keyUp);
// }
// componentWillUnmount() {
//   window.removeEventListener('keydown', this.keyDown);
//   window.removeEventListener('keyup', this.keyUp);
// }
// componentDidMount() {
//   this.load()
// }
// keyDown = (e) => {
//   // console.log(e.keyCode)
//   // Shift key
//   if (e.keyCode === 16 && e.keyCode !== 17) {
//     this.setState({
//       record: true,
//     })
//   }
//   // Right key
//   if (e.keyCode === 39) {
//     console.log('haha')
//     this.next()
//   }
//   // Escape
//   if (e.keyCode === 27) {
//     this.setState({
//       record: false,
//       blob: null,
//     })
//   }
// }
// keyUp = (e) => {
//   if (e.keyCode === 16) {
//     this.setState({
//       record: false,
//     })
//   }
// }
//
// onStop = (recordedBlob) => {
//   // console.log('recordedBlob is: ', recordedBlob);
//   this.setState({
//     blob: recordedBlob
//   })
// }
//
// load = async () => {
//   // const content = (await axios.get(`/api/recorder`)).data
//   // this.setState({
//   //   word: content[0],
//   //   remaining: content.slice(1)
//   // })
// }
//
// next = () => {
//   let { blob, word } = this.state
//   if (blob) {
//     this.setState({ blob: null })
//
//     var reader = new window.FileReader();
//     reader.readAsDataURL(blob.blob);
//     reader.onloadend = () => {
//       // console.log(reader.result)
//       // let data = new FormData();
//       // data.append('file', reader.result, 'audio.wav');
//       // data.append(blob.blob)
//       // console.log(data)
//
//       axios.post('/api/recorder/save', {
//         word,
//         data: reader.result,
//       })
//     }
//
//   }
//   if (this.state.remaining < 1) return
//   this.setState({
//     word: this.state.remaining[0],
//     remaining: this.state.remaining.slice(1)
//   })
// }
