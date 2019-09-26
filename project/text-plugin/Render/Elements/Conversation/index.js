import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
// import Answers from './Answers'
// import { AudioPlayer } from 'text-plugin/Audio/AudioPlayer'
// import { ReadAlongSetup, ReadAlongMessage } from 'text-plugin/Audio/ReadAlong'
require('array-sugar')

class Conversation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    console.log(props.children)
  }
  render() {
    const { conversation, id, section_id } = this.props
    const { audioId, inline, src, isInteractive, done } = this.state
    return <div className={`conversation ${isInteractive?'interactive':''}`}>
      <div className={`conversationWindow`} data-initialized>
        {/* {audioId && <AudioPlayer audioId={audioId} inline={inline} src={src} hidden={isInteractive}/>} */}

        {/* {conversation.slice(0,this.state.howManyToShow)
          .filter(element => element.type==='message')
          .map((element, index) => (
          <div key={index}>
            <div className={element.from}>
              <div className="bubble-container">
                <div className="bubble">
                  <div dangerouslySetInnerHTML={{__html: element.message}}/>
                </div>
              </div>
            </div>
          </div>
        ))} */}
      </div>

      {/* Answers */}
      {isInteractive && <div className="response" key="response">
        {!done && <Answers element={this.state.answers} submit={this.submit}/>}
        {done && <div>
          <div className="button-container center">
            <div className="button blue" onClick={this.reset}>Repeat</div>{' '}
            <div className="button blue" onClick={()=>{
              store.dispatch({
                type: 'NEXT',
                section_id
              })
            }}>Next card</div>
          </div>
        </div>}
      </div>}
    </div>
  }
}
export default Conversation
