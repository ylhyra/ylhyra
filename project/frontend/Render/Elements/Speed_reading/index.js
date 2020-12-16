import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
// require('array-sugar')
import { checkKey, mouseListener } from './actions/eventListeners'
import { start, startStop, prevWord, close, reset } from './actions/start'
import { load } from './actions/load'
const supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

@connect(state => ({
  speed_reader: state.speed_reader,
}))
class SpeedReader extends React.Component {
  componentDidMount = () => {
    load()
    $('body').addClass('unscrollable')
    // $('#speed-reader').on('click', startStop)
    document.addEventListener('keydown', checkKey);
    supportsTouch && document.addEventListener('mousemove', mouseListener);
  }
  componentWillUnmount = () => {
    $('body').removeClass('unscrollable')
    document.removeEventListener('keydown', checkKey);
    supportsTouch && document.removeEventListener('mousemove', mouseListener);
  }
  render() {
    const { started, wpm, cur, words, running, skin, mouse_hidden } = this.props.speed_reader

    let classes = []
    classes.push(skin)
    running && classes.push('running')
    mouse_hidden && running && classes.push('mouse_hidden')
    return <div id="speed-reader" className={classes.join(' ')} onClick={startStop}>
      {started ? <PlayScreen/> : <AboutScreen/>}
      {words.length > 0 && <div id="speed-reader-status" style={{width:(cur/words.length*100)+'%'}}></div>}
    </div>
  }
}

export default SpeedReader

@connect(state => ({
  speed_reader: state.speed_reader,
}))
class Header extends React.Component {
  render() {
    const { started, wpm, cur, words, running, skin, mouse_hidden } = this.props.speed_reader
    return <div id="speed-reader-header" className="noclick" onClick={(e)=>e.stopPropagation()}>
      <a onClick={()=>{
        stop()
        store.dispatch({
          type: 'SPEED_READER_UPDATE',
          started: false,
        })
      }} className={started?'':'inactive'}>Settings</a>
      {started&&<a onClick={prevWord} className={cur>0?'':'inactive'}>Previous word</a>}
      {(started||cur>0)&&<a onClick={reset}>Restart</a>}
      <a onClick={startStop}><b>{running ? 'Pause':'Play'}</b></a>

      <div className="spacer"/>
      <a onClick={close}>Exit</a>
    </div>
  }
}

@connect(state => ({
  speed_reader: state.speed_reader,
}))
class PlayScreen extends React.Component {
  render() {
    const { started, wpm, cur, words, running, skin, mouse_hidden, showTranslation } = this.props.speed_reader
    return (
      <div id="speed-reader-inner">
        <div className="speedreader_section">
          <Header/>
          <div className="speedreader_spacer"/>
          <div className="speedreader_translation">{(!running || showTranslation) && (words[cur].translation||'')}</div>
        </div>
        <div id="speedreader_output">
          <Word word={words[cur].text||''} key={cur}/>
        </div>
        <div className="speedreader_section">
          <div className="speedreader_spacer"/>
          <div className="speedreader_translation">{!running && (words[cur].sentenceTranslation||'')}</div>
        </div>
      </div>
    )
  }
}

@connect(state => ({
  speed_reader: state.speed_reader,
}))
class AboutScreen extends React.Component {
  render() {
    const { started, wpm, cur, words, running, skin, mouse_hidden } = this.props.speed_reader

    return (
      <div id="speed-reader-inner">
        <Header/>
        <div id="speed-reader-logo" onClick={close}>Ylhýra</div>
        <h1>Speed reading mode</h1>
        <div>
          <p>This is an exercise that trains you to immediately recognize words just from their shapes instead of having to read each letter. Being able to immediately recognize words makes reading faster, more enjoyable, and allows you to comprehend longer text with more ease. </p>
          <p>This exercise also trains you to read without giving up half-way through.</p>
          <p>We recommend starting with a low speed (75 words per minute). When you can comfortably read at that speed, increase the speed by +25 and read the same text again. Repeat the process until you’re able to comfortaby read the text at 200 words per minute.</p>
          <p>To use this tool with other text, click <a href="https://speedreader.ylhyra.is/">here</a>.</p>
        </div>
        <div>
          <Settings/>
          <div className="noclick" onClick={(e)=>e.stopPropagation()}>
            <button id="start" onClick={start}>Start</button>
            {/* <div id="tutorial" className="gray">
              Click "space" to pause and start, <br/> "left" and "right" arrow buttons to go backwards and forwards,<br/> "up" and "down" arrow buttons to change speed.
            </div>  */}
          </div>
        </div>
      </div>
    )
  }
}


class Word extends React.Component {
  componentDidMount = () => {
    if (!this.props.word) return null;
    const el = document.getElementById('speedreader_output')
    if (!el) return;
    const outputWidth = el.getBoundingClientRect().width
    const w = document.getElementById('speedreader_word')
    const wordWidth = w.getBoundingClientRect().width
    let leftpad = (outputWidth - wordWidth * 0.6) / 2 - 10
    if (wordWidth >= leftpad / 2) {
      leftpad = Math.min(leftpad, (outputWidth - wordWidth))
    }
    w.setAttribute('style', `display:block;width:${Math.ceil(wordWidth)}px;margin-left:${Math.floor(Math.max(0,leftpad))}px`)
  }
  shouldComponentUpdate = () => {
    return false
  }
  render() {
    return <span id="speedreader_word">{this.props.word}</span>
  }
}


const handleChange = (prop, value) => {
  store.dispatch({
    type: 'SPEED_READER_UPDATE',
    [prop]: value,
  })
}

@connect(state => ({
  speed_reader: state.speed_reader,
}))
class Settings extends React.Component {
  render() {
    const { started, wpm, cur, words, running, skin, mouse_hidden } = this.props.speed_reader
    let available_speeds = []
    for (let i = 25; i <= 600; i += 25) {
      available_speeds.push(i)
    }

    return <div className="noclick" onClick={(e)=>e.stopPropagation()}>
      <div>
        <label htmlFor="wpm">Speed: </label>
        <select id="wpm" value={wpm} onChange={(e)=>handleChange('wpm',e.target.value)}>
          {available_speeds.map(j => (
            <option value={j} key={j}>
              {j} words per minute
            </option>
          ))}
        </select>
        <span id="time" className="gray"></span>
      </div>
      <div>
        <label htmlFor="skin">Colors: </label>
        <select id="skin" value={skin} onChange={(e)=>handleChange('skin',e.target.value)}>
          <option value="blackonwhite">Black text on a white background</option>
          <option value="blackonlight">Black text on an orange background</option>
          <option value="whiteonblack">White text on a black background</option>
          <option value="yellowonblack">Yellow text on a black background</option>
        </select>
      </div>
    </div>
  }
}
