import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'

@connect(state => ({
  speed_reader: state.speed_reader,
}))
class SpeedReader extends React.Component {
  componentDidMount = () => {}
  handleChange(prop, event) {
    store.dispatch({
      type: 'SPEED_READER_UPDATE',
      prop,
      value: event.target.value
    })
  }
  render() {


    // {editor.tokenized.map((paragraph, index) => (
    //   // Paragraph
    //   <div className="paragraph" key={index}>
    //     {paragraph.sentences.map(sentence => (
    //       // Sentence
    //       <div className="sentence-container" key={sentence.id}>
    //         <div>
    //           {sentence.words.map(word => {
    //             // Word
    //             if(typeof word === 'string') {
    //               return word
    //             } else {
    //               return <Word id={word.id} key={word.id}>{word.text}</Word>
    //             }
    //           })}
    //         </div>
    //         <SentenceTranslation id={sentence.id}/>
    //       </div>
    //     ))}
    //   </div>
    // ))}



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
      <h1>Speed reading mode</h1>
      <p>
        This exercise aims to teach you to immediately recognize words just from their shapes instead of having to read each letter.

         {/* <a href="https://speedreader.ylhyra.is/">here</a> */}
      </p>
      <div id="noclick">
        <div>
          <label htmlFor="wpm">Speed: </label>
          <select id="wpm" value={this.props.speed_reader.wpm} onChange={(e)=>this.handleChange('wpm',e)}>
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
          <select id="skin" value={this.props.speed_reader.skin} onChange={(e)=>this.handleChange('skin',e)}>
            <option value="Black on white">Black on white</option>
            <option value="Black on light">Black on light</option>
            <option value="White on black">White on black</option>
            <option value="Yellow on black">Yellow on black</option>
          </select>
        </div>
        <div>
          <button id="start">Start</button>
          <button id="reset">Restart</button>
        </div>
        <div id="tutorial" className="gray">
          Click "space" to pause and start, <br/> "left" and "right" arrow buttons to go backwards and forwards,<br/> "up" and "down" arrow buttons to change speed.
        </div>
      </div>
    </div>
  }
}

export default SpeedReader
