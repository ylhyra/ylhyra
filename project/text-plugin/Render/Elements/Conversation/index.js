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
    }, 0)
    setTimeout(() => {
      this.setState({
        card: null,
        answer: null,
        done: this.state.howManyToShow + 1 >= this.state.conversation.length,
      })
    }, 3300)
  }
  next = () => {
    this.setState({
      howManyToShow: this.state.howManyToShow + 1,
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
          .map((element, index) => (
          <div key={index}>
            <div className={element.from}>
              <div className="bubble-container">
                <div className="bubble">
                  {element.message}
                  {/* <div dangerouslySetInnerHTML={{__html: element.message}}/> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* answer */}
      {isInteractive && <div className="response" key="response">
        {!done && card && <Card card={card} answer={answer} submitAnswer={this.submitAnswer} insideConversation/> }

        {/* {!done && <answer card={card} answer={answer} submitAnswer={this.submitAnswer}/>} */}
        {done && <div>
          <div className="button-container center">
            <div className="button blue" onClick={this.reset}>Repeat</div>{' '}
            {/* <div className="button blue" onClick={()=>{
              store.dispatch({
                type: 'NEXT',
                section_id
              })
            }}>Next card</div> */}
          </div>
        </div>}
      </div>}
    </div>
  }
}
export default Conversation

// /*
//   Find .me & .them
// */
// const Parse = (children) => {
//   let output = []
//   const Traverse = (input) => {
//     if (Array.isArray(input)) {
//       input.forEach(Traverse)
//     } else if (typeof input === 'object' || typeof input === 'function') {
//       if (input.type === 'ul' || input.type === 'li') {
//         Traverse(input.props.children)
//       } else if (input.props.className === 'them' || input.props.className === 'me') {
//         output.push({
//           type: 'message',
//           from: input.props.className,
//           message: input.props.children
//         })
//       } else {
//         console.warn({
//           message: 'Unused in Parse()',
//           input
//         })
//       }
//     }
//   }
//   Traverse(children)
//   // console.log(output)
//   return output
// }
