import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
// import { AudioPlayer } from 'text-plugin/Audio/AudioPlayer'
// import { ReadAlongSetup, ReadAlongMessage } from 'text-plugin/Audio/ReadAlong'
require('array-sugar')
import { ParseHTMLtoObject, ParseHTMLtoArray } from 'Render/Elements/parse'
import Card from 'Render/Elements/Vocabulary/Card'
import { randomizeOptions } from 'Render/Elements/Vocabulary/randomize'

class Conversation extends React.Component {
  constructor(props) {
    super(props);
    const conversation = ParseHTMLtoArray(props.children)
    // console.log(conversation)
    // console.log(props.children)
    const isInteractive = conversation.find(x => x.type !== 'message')
    this.state = {
      conversation,
      isInteractive,
      card: null,
      answer: null,
      howManyToShow: isInteractive ? 0 : 1000,
    }
    // console.log(JSON.stringify(ParseHTMLtoArray(props.children), null, 2))
  }

  componentDidMount = () => {
    if (this.state.isInteractive) {
      this.next()
    }
  }
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (!this.state.isInteractive) return;
    if (prevState.howManyToShow !== this.state.howManyToShow) {
      const last = this.state.conversation.slice(0, this.state.howManyToShow).last
      if (last && last.type !== 'message') {
        // console.log({ last })
        this.setState({
          card: randomizeOptions(last),
        })
      } else {
        setTimeout(() => {
          this.checkIfWeShouldGoToTheNext()
        }, 1000)
        // if(this.audioId) {
        //   ReadAlongMessage(last.message, this.audioId)
        // }
      }
    }
  }
  checkIfWeShouldGoToTheNext = () => {
    /* Need to check again outside of "componentDidUpdate" since it may have been updated since last time */
    const last = this.state.conversation.slice(0, this.state.howManyToShow).last || {}
    if (last.type === 'message' && this.state.howManyToShow < this.state.conversation.length) {
      this.next()
    }
  }
  submitAnswer = ({ correct, index }) => {
    /* Todo: This duplicates Vocabulary/index.js */
    const { answer } = this.state
    if (answer && answer.answered) {
      return null
    }
    this.setState({
      answer: {
        correct,
        selected_index: index,
        answered: true,
      }
    })

    setTimeout(() => {
      this.next()
    }, 3300)
    // setTimeout(() => {
    //   this.setState({
    //     card: null,
    //     answer: null,
    //     done: this.state.howManyToShow + 1 >= this.state.conversation.length,
    //   })
    // }, 3300)
  }
  next = () => {
    this.setState({
      howManyToShow: this.state.howManyToShow + 1,
      answer: null,
      card: null,
      selected_index: null,
      done: this.state.howManyToShow + 1 >= this.state.conversation.length,
    })
  }
  reset = () => {
    this.setState({
      howManyToShow: 0,
      done: false,
      card: null,
      answer: null,
    })
    setTimeout(() => {
      this.next()
    }, 200)
  }

  render() {
    const { conversation, isInteractive, done, answer, card, howManyToShow } = this.state
    // console.log({card, answer})
    return <div className={`conversation ${isInteractive?'interactive':''}`}>
      <div className={`conversationWindow`} data-initialized>
        {/* {audioId && <AudioPlayer audioId={audioId} inline={inline} src={src} hidden={isInteractive}/>} */}

        {conversation.slice(0, howManyToShow)
          .filter(element => element.type==='message')
          .reduce(mergeMessages, [])
          .map((element, index) => (
          <div key={index}>
            <div className={element.from}>
              {element.messages.map((message,index2) =>
                <div className="bubble-container" key={index2}>
                  <div className="bubble">
                    {message}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isInteractive && <div className="response" key="response">
        {!done && card && <Card card={card} answer={answer} submitAnswer={this.submitAnswer} insideConversation/> }
        {done && <div>
          <div className="button-container center">
            <div className="button blue" onClick={this.reset}>Repeat</div>{' '}
          </div>
        </div>}
      </div>}
    </div>
  }
}
export default Conversation


const mergeMessages = (accumulator, currentValue) => {
  if (accumulator.length === 0 || accumulator.last.from !== currentValue.from) {
    accumulator.push({
      ...currentValue,
      messages: [currentValue.message]
    })
  } else {
    accumulator.last.messages.push(currentValue.message)
  }
  return accumulator
}
