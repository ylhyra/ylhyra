import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import { ReadAlong, ReadAlongSetup } from './ReadAlong'
import SmoothScroll from './Scroll/SmoothScroll'
import store from 'User/App/store'
import { ParseHTMLtoObject, ParseHTMLtoArray } from 'User/Render/Elements/parse'
import tapOrClick from 'react-tap-or-click'
import NotifyError from 'User/App/Error'
require('./KeyboardListener')
require('array-sugar')
let timer

class Audio extends React.PureComponent {
  errorCount = 0; // Keep count on how often we have re-attempted reloading file
  constructor(props) {
    super(props);
    this.audio = React.createRef()
    let data
    if (this.props.children) {
      data = ParseHTMLtoObject(this.props.children)
    } else {
      data = {
        filename: this.props.filename,
        filepath: this.props.filepath,
      }
    }
    this.state = {
      data,
      playing: null,
      currentTimePercentage: 0,
      key: 0, // To force remounting if an error occurs
    }
  }
  componentDidMount = () => {
    const { video } = this.state.data
    // /* Autoplay video */
    // if(video) {
    //   this.pausePlayButton()
    // }
  }
  componentDidUpdate = (prevProps) => {
    const { audio } = this.refs
    /* Pause if another audio element has taken over */
    if (this.props.audio.currentlyPlaying !== this.state.data.filename) {
      this.setState({ playing: false })
      audio && audio.pause()
    } else if (this.props.audio.begin !== prevProps.audio.begin) {
      if (this.props.audio.end === null) {
        timer && clearTimeout(timer)
        this.setState({ stopAt: null })
      } else {
        console.log(this.props.audio.begin)
        audio.currentTime = this.props.audio.begin
        audio && audio.play()
        this.setState({ stopAt: this.props.audio.end - 0.05 })
      }
    }
  }
  pausePlayButton = () => {
    const { audio } = this.refs
    if (audio.duration - audio.currentTime < 0.3) {
      audio.currentTime = 0
    }
    if (audio.paused || audio.currentTime === 0) {
      audio && audio.play()
      this.setState({
        playing: true,
        stopAt: null,
      })
      this.updateStore()
    } else {
      audio && audio.pause()
      this.setState({
        playing: false,
        stopAt: null,
      })
    }
  }
  playing = (event) => {
    const { audio } = this.refs
    event.persist()
    ReadAlong(audio, 'play', this.state.data.filename)
    if (audio.duration - audio.currentTime > 0.2) { // More than 0.1 seconds left
      this.setState({
        currentTimePercentage: (audio.currentTime / audio.duration) * 100
      })
    } else {
      this.setState({
        currentTimePercentage: 0
      })
    }
    this.updateStore()
    this.setState({ playing: true })
    if (this.state.stopAt) {
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        audio.pause()
        this.setState({
          playing: false,
          stopAt: null,
        })
      }, (this.state.stopAt - audio.currentTime) * 1000)
    }
  }
  loading = (event) => {
    const { audio } = this.refs
    this.setState({
      loading: true,
    })
  }
  canplay = (event) => {
    const { audio } = this.refs
    this.setState({
      loading: false,
    })
  }
  play = (event) => {
    event && event.persist()
    SmoothScroll.allow()
    ReadAlong(this.refs.audio, 'play', this.state.data.filename)
    this.updateStore()
    this.setState({ playing: true })
  }
  pause = (event) => {
    event.persist()
    SmoothScroll.stop()
    ReadAlong(this.refs.audio, 'pause', this.state.data.filename)
    this.setState({ playing: false })
  }
  ended = () => {
    // const { audio } = this.refs
    // audio.pause()
    this.setState({
      currentTimePercentage: 0,
      playing: false
    })
    this.setState({ playing: false })
  }
  updateStore = () => {
    this.props.audio.currentlyPlaying !== this.state.data.filename && store.dispatch({
      type: 'CURRENTLY_PLAYING',
      content: this.state.data.filename,
    })
  }
  error = (e) => {
    console.log(e)
    console.warn(`File missing: ${this.state.data.filepath}`)
    if (this.errorCount++ > 1) {
      return NotifyError('Could not load file.', undefined, true)
    } else {
      this.setState({
        key: this.state.key + 1,
      })
      console.warn(`Attempted to remount file: ${this.state.data.filepath}`)
    }
  }
  render() {
    const { playing, loading, error, currentTimePercentage } = this.state
    const { filepath, inline, video, label } = this.state.data
    if (!filepath) return null;
    let ContainerTag = 'div'
    if (inline) {
      ContainerTag = 'span'
    }
    let Tag = video ? 'video' : 'audio'

    return (
      <ContainerTag className={`audioPlayer ${playing ? playing : ''} ${error ? 'error' : ''} ${inline ? 'inline' : ''} ${video ? 'video' : ''}`} data-ignore key={this.state.key}>
        <Tag // controls
        ref="audio"
        // preload="none" // TEMP
        loop={Boolean(video)}
        onLoadStart={this.loading}
        onPlaying={this.playing}
        onTimeUpdate={this.playing}
        onPlay={this.play}
        onPause={this.pause}
        onCanPlay={this.canplay}
        onError={this.error}
        onEnded={this.ended}
        onStalled={this.error}
        onClick={video ? ()=>{} : this.pausePlayButton}
        controls={Boolean(video)}
        >
          <source src={filepath} type={video ? 'video/mp4': 'audio/mp3'}/>
        </Tag>
        <span className={`button small playButton ${playing ? playing : ''}`} onClick={this.pausePlayButton}>
          <span>
            {/* {loading ? 'Loading' : 'Not loading'} */}
            {playing ? /*'❚❚'*/'Pause' : (label ? `▶  ${label}`: '▶ Play')}
          </span>
          <span className="percentage" style={{width:currentTimePercentage+'%'}}/>
        </span>
        {/* {(playing || currentTimePercentage !== 0) && (
          <div className="button small" onClick={this.ended}>Reset</div>
        )} */}
        {this.state.loading && <div className="loader"/>}
        {!inline && this.state.error && <div className="error"><span>File missing.</span></div>}
      </ContainerTag>
    )
  }
}
export default connect(state => ({
  audio: state.audio,
}))(Audio)
