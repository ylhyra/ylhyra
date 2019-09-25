import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import Answers from './Answers'
import { AudioPlayer } from 'text-plugin/Audio/AudioPlayer'
import { ReadAlongSetup, ReadAlongMessage } from 'text-plugin/Audio/ReadAlong'
require('array-sugar')

class Conversation extends React.Component {
  constructor(props) {
    super(props);
    /*
      TEMP
      TODO:
      Merge this init step with the general Audio-init
    */
    let audioId, inline, src
    const e = this.props.audio
    if (e) {
      audioId = e.dataset.id
      inline = e.dataset.inline
      src = e.dataset.src
      if (e.dataset.synchronizationList) {
        const syncList = JSON.parse(e.dataset.synchronizationList)
        ReadAlongSetup(audioId, syncList)
      }
      this.audioId= audioId
    }

    const isInteractive = this.props.conversation.findIndex(i => i.type === 'answers') > -1

    //TEMP
    this.state = {
      answers: null,
      howManyToShow: isInteractive ? 0 : 1000,
      audioId,
      inline,
      isInteractive,
      src,
    }
  }
  componentDidMount = () => {
    if (this.state.isInteractive) {
      console.log('DID MOUNT')
      this.next()
    }
  }
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (!this.state.isInteractive) return;
    if (prevState.howManyToShow !== this.state.howManyToShow) {
      const last = this.props.conversation.slice(0, this.state.howManyToShow).last || {}
      if (last.type === 'answers') {
        this.setState({
          answers: last,
        })
      } else {
        setTimeout(() => {
          this.checkIfWeShouldGoToTheNext()
        }, 1000)
        if(this.audioId) {
          ReadAlongMessage(last.message, this.audioId)
        }
      }
    }
  }
  checkIfWeShouldGoToTheNext = () => {
    /* Need to check again outside of "componentDidUpdate" since it may have been updated since last time */
    const last = this.props.conversation.slice(0, this.state.howManyToShow).last || {}
    if (last.type !== 'answers' && this.state.howManyToShow < this.props.conversation.length) {
      this.next()
    }
  }
  submit = () => {
    setTimeout(() => {
      this.next()
    }, 1000)
    setTimeout(() => {
      this.setState({ answers: null })
    }, 1800)
  }
  next = () => {
    this.setState({
      howManyToShow: this.state.howManyToShow + 1,
      done: this.state.howManyToShow + 1 >= this.props.conversation.length,
    })
  }
  reset = () => {
    this.setState({
      howManyToShow: 0,
      done: false,
      answers: null,
    })
    setTimeout(() => {
      this.next()
    }, 200)
  }
  render() {
    // console.log(this.props.conversation)
    // console.log(this.state.howManyToShow)
    const { conversation, id, section_id } = this.props
    const { audioId, inline, src, isInteractive, done } = this.state
    // console.log(this.state.answers)
    return <div className={`conversation ${isInteractive?'interactive':''}`} data-initialized>
      <div className={`conversationWindow`} data-initialized>
        {audioId && <AudioPlayer audioId={audioId} inline={inline} src={src} hidden={isInteractive}/>}

        {conversation.slice(0,this.state.howManyToShow)
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
        ))}
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
