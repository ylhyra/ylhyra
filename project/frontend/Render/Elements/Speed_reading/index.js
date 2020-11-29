import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
// require('array-sugar')
import { start } from './actions'
@connect(state => ({
  speed_reader: state.speed_reader,
}))
class SpeedReader extends React.Component {
  componentDidMount = () => {
    let words = []
    let book = $('.book').clone()
    book.find('.box, .word-box, .tooltip').remove()
    book.find('p').each((pi, paragraphEl) => {
      words.last && words.push({
        length: 2,
        type: 'pause'
      })
      $(paragraphEl).find('.sentence').each((si, sentenceEl) => {
        words.last && words.last.type !== 'pause' && words.push({
          length: 1,
          type: 'pause'
        })

        const sentenceId = $(sentenceEl).attr('id')
        const sentenceTranslation = $('.book').find(`#${sentenceId}-box .meaning`).text()

        $(sentenceEl).contents().each((ii, item) => {
          if (item.nodeType === Node.TEXT_NODE) {
            if ($(item).text().trim() === '') return;
            words.push({
              text: $(item).text(),
              type: 'punctuation'
            })
          } else {
            const text = $(item).text()
            const itemId = $(item).find('.word[data-word-has-definition]').attr('id')
            const translation = $('.book').find(`#${itemId}-tooltip .meaning`).text()
            words.push({
              text,
              translation,
              sentenceTranslation,
            })
          }
        })
      })
    })
    words = words.map((item, index) => {
      if (item.type === 'punctuation') {
        const split = item.text.split(/^([^ ]+)?(.+?)?([^ ]+)?$/)
        let first = split[1]
        let middle = split[2]
        let end = split[3]
        if (first && words[index - 1] && words[index - 1].text) {
          words[index - 1].text += first
          first = null
        }
        if (first && !middle && !end) {
          end = first
          first = null
        }
        if (end && words[index + 1] && words[index + 1].text) {
          words[index + 1].text = end + words[index + 1].text
          end = null
        }
        const remaining = (first || '') + (middle || '') + (end || '')
        if (remaining.trim()) {
          return {
            text: remaining.trim(),
            type: 'punctuation'
          }
        }
        return null
      }
      if (item.type === 'pause' && item.length === 1) {
        if (words[index - 1] && words[index - 1].text) {
          if (/[,;]$/.test(words[index - 1].text)) {
            return null
          }
        }
      }
      return item
    }).filter(Boolean)
    // console.log(words)

    this.handleChange('words', words)

  }
  handleChange(prop, value) {
    store.dispatch({
      type: 'SPEED_READER_UPDATE',
      prop,
      value,
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

      {this.props.speed_reader.running ? (
        <div>
          <div id="output">{this.props.speed_reader.words[this.props.speed_reader.cur].text||''}</div>
          <div id="">{this.props.speed_reader.words[this.props.speed_reader.cur].translation||''}</div>
          <div id="">{this.props.speed_reader.words[this.props.speed_reader.cur].sentenceTranslation||''}</div>
        </div>
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
  componentDidMount = () => {}
  render() {}
}
