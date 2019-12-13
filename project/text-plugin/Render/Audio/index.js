import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import { ReadAlong, ReadAlongSetup } from './ReadAlong'
import SmoothScroll from './Scroll/SmoothScroll'
import store from 'App/store'
require('./KeyboardListener')
require('array-sugar')
import { ParseHTMLtoObject, ParseHTMLtoArray } from 'Render/Elements/parse'
import tapOrClick from 'react-tap-or-click'
let timer

@connect(state => ({
  audio: state.audio,
}))
class Audio extends React.PureComponent {
  constructor(props) {
    super(props);
    this.audio = React.createRef()
    this.state = {
      data: ParseHTMLtoObject(this.props.children),
      playing: null,
      currentTimePercentage: 0,
    }
  }
  componentDidMount = () => {}
  componentDidUpdate = (prevProps) => {
    const { audio } = this.refs
    /* Pause if another audio element has taken over */
    if (this.props.audio.currentlyPlaying !== this.state.data.filename) {
      this.setState({ playing: false })
      audio.pause()
    } else if (this.props.audio.begin !== prevProps.audio.begin) {
      if (this.props.audio.end === null) {
        timer && clearTimeout(timer)
        this.setState({ stopAt: null })
      } else {
        console.log(this.props.audio.begin)
        audio.currentTime = this.props.audio.begin
        audio.play()
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
      audio.play()
      this.setState({
        playing: true,
        stopAt: null,
      })
      this.updateStore()
    } else {
      audio.pause()
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
  play = (event) => {
    event.persist()
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
  error = () => {
    console.warn(`Audio file missing: ${this.props.src}`)
    this.setState({
      error: true,
    })
  }
  render() {
    const { playing, error, currentTimePercentage } = this.state
    const { filepath, inline } = this.state.data
    if (!filepath) return null;
    let Tag = 'div'
    if (inline) {
      Tag = 'span'
    }

    return (
      <Tag className={`audioPlayer ${playing ? playing : ''} ${error ? 'error' : ''} ${inline ? 'inline' : ''}`}>
        <audio // controls
        ref="audio"
        onPlaying={this.playing}
        onTimeUpdate={this.playing}
        onPlay={this.play}
        onPause={this.pause}
        onCanPlay={this.canplay}
        onError={this.error}
        onEnded={this.ended}
        onStalled={this.error}
        >
          <source src={filepath} type="audio/mp3"/>
        </audio>
        <div className={`button small playButton ${playing ? playing : ''}`} onClick={this.pausePlayButton}>
          <span>{playing ? '❚❚ Pause' : '▶ Play'}</span>
          <span className="percentage" style={{width:currentTimePercentage+'%'}}/>
        </div>
        {/* {(playing || currentTimePercentage !== 0) && (
          <div className="button small" onClick={this.ended}>Reset</div>
        )} */}
        {this.state.loading && <div className="loader"/>}
        {!inline && this.state.error && <div className="error"><span>Audio file missing.</span></div>}
      </Tag>
    )
  }
}
export default Audio
