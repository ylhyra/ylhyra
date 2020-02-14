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

const TESTING_WITH_LOCALHOST = false
const url = TESTING_WITH_LOCALHOST ? 'https://localhost:8000' : ''

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
      if (!reader.result) {
        return console.error('Could not read')
      }
      const base64_data = reader.result.match(/^data:.+\/(.+);base64,(.*)$/)[2]
      const word = this.props.word
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
      const filename = (await axios.post(url + '/api/recorder/save', {
        type: 'RECORDER',
        word,
        speaker: mw.config.get('wgUserName'),
        should_save: process.env.NODE_ENV === 'production',
        base64_data,
      })).data
      console.log(filename)
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Not saving in database since we\'re in development mode')
      }
      if (TESTING_WITH_LOCALHOST) {
        return;
      }
      var api = new mw.Api()
      api.postWithToken('csrf', {
        filename,
        text: word && `{{spoken|${word}}}`,
        url: `https://ylhyra.is/api/temp_files/${filename}`,
        action: 'upload',
        ignorewarnings: '1',
        format: 'json'
      }).done(function(data) {
        if (this.props.onFinish) {
          this.props.onFinish(filename)
        } else {
          console.log(data);
          store.dispatch({
            type: 'SOUND_BITE_FILE',
            word,
            filename: 'https://ylhyra.is/Special:Redirect/file/' + filename,
          })
        }
        // saveEditor()
      }).fail(function(error) {
        if (error === 'fileexists-no-change') return;
        console.error(error)
      })
    }
  }
  cancel = () => {
    this.setState({
      saved: true,
      blob: null,
    })
  }
  render() {
    // if (!this.props.word) return null
    return (
      <div>
        <div onMouseEnter={this.start} onMouseLeave={this.stop} className={`recorder ${this.state.recording ? 'recording': ''}`}>
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
