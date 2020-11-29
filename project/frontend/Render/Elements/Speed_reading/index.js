import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
// require('array-sugar')
import { start } from './actions'
import { load } from './load'

@connect(state => ({
  speed_reader: state.speed_reader,
}))
class SpeedReader extends React.Component {
  componentDidMount = () => {
    load()
  }
  handleChange(prop, value) {
    store.dispatch({
      type: 'SPEED_READER_UPDATE',
      [prop]: value,
    })
  }
  render() {

    /* Render WPM dropdown */
    let available_speeds = []
    for (let i = 25; i <= 600; i += 25) {
      available_speeds.push(i)
    }
    // if (!available_speeds.includes(state.wpm)) {
    //   available_speeds.push(wpm)
    //   available_speeds = available_speeds.sort((a, b) => a - b)
    // }
    //
    let classes = []
    classes.push(this.props.speed_reader.skin.replace(/ /g, '').toLowerCase())
    return <div id="speed-reader" className={classes.join(' ')}>

      <Output key={this.props.speed_reader.cur} speed_reader={this.props.speed_reader}/>
      {this.props.speed_reader.running ? (
        null
      ) : (
        <div>
          <h1>Speed reading mode</h1>
          <p>
            This exercise aims to teach you to immediately recognize words just from their shapes instead of having to read each letter.

             {/* <a href="https://speedreader.ylhyra.is/">here</a> */}
          </p>
          <div id="noclick">
            <div>
              <label htmlFor="wpm">Speed: </label>
              <select id="wpm" value={this.props.speed_reader.wpm} onChange={(e)=>this.handleChange('wpm',e.target.value)}>
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
              <select id="skin" value={this.props.speed_reader.skin} onChange={(e)=>this.handleChange('skin',e.target.value)}>
                <option value="Black on white">Black on white</option>
                <option value="Black on light">Black on light</option>
                <option value="White on black">White on black</option>
                <option value="Yellow on black">Yellow on black</option>
              </select>
            </div>
            <div>
              <button id="start" onClick={()=>{
                start()
              }}>Start</button>
              {/* <button id="reset">Restart</button> */}
            </div>
            <div id="tutorial" className="gray">
              Click "space" to pause and start, <br/> "left" and "right" arrow buttons to go backwards and forwards,<br/> "up" and "down" arrow buttons to change speed.
            </div>
          </div>
        </div>
      )}
    </div>
  }
}

export default SpeedReader



class Output extends React.Component {
  componentDidMount = () => {
    const el = document.getElementById('speedreader_output')
    if(!el) return;
    const outputWidth = el.getBoundingClientRect().width
    const w = document.getElementById('speedreader_word')
    const wordWidth = w.getBoundingClientRect().width
    let leftpad = (outputWidth - wordWidth * 0.6) / 2 - 10
    if (wordWidth >= leftpad / 2) {
      leftpad = Math.min(leftpad, (outputWidth - wordWidth))
    }
    w.setAttribute('style', `display:block;width:${Math.ceil(wordWidth)}px;margin-left:${Math.floor(Math.max(0,leftpad))}px`)
  }
  render() {
    const { words, cur } = this.props.speed_reader
    if(!words[cur])return null;
    return <div id="speedreader_output">
      <div id="">{words[cur].translation||''}</div>
      <div id="speedreader_word">{words[cur].text||''}</div>
      <div id="">{words[cur].sentenceTranslation||''}</div>
    </div>
  }
}
