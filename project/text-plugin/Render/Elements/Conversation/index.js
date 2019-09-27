import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import Answers from './Answers'
// import { AudioPlayer } from 'text-plugin/Audio/AudioPlayer'
// import { ReadAlongSetup, ReadAlongMessage } from 'text-plugin/Audio/ReadAlong'
require('array-sugar')
import { ParseHTMLtoObject, ParseHTMLtoArray } from 'Render/Elements/parse'

class Conversation extends React.Component {
  constructor(props) {
    super(props);
    const conversation = ParseHTMLtoArray(props.children)
    this.state = {
      conversation,
      isInteractive: conversation.find(x => x.name === 'options'),
      answers: {},
    }
    console.log(JSON.stringify(ParseHTMLtoArray(props.children), null, 2))
  }

  submitAnswer = ({ correct, index }) => {
    // const { card, answer } = this.state
    // if (answer.answered) {
    //   return null
    // }
    // this.setState({
    //   answer: {
    //     correct,
    //     selected_index: index,
    //     answered: true,
    //   }
    // })
  }

  render() {
    const { id, section_id } = this.props
    const { conversation, audioId, inline, src, isInteractive, done, answer } = this.state
    return <div className={`conversation ${isInteractive?'interactive':''}`}>
      <div className={`conversationWindow`} data-initialized>
        {/* {audioId && <AudioPlayer audioId={audioId} inline={inline} src={src} hidden={isInteractive}/>} */}

        {conversation.slice(0,this.state.howManyToShow)
          .filter(element => element.name==='message')
          .map((element, index) => (
          <div key={index}>
            <div className={element.from}>
              <div className="bubble-container">
                <div className="bubble">
                  {element.children}
                  {/* <div dangerouslySetInnerHTML={{__html: element.message}}/> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Answers */}
      {isInteractive && <div className="response" key="response">
        {!done && <Answers options={this.state.answers} answer={answer} submitAnswer={this.submitAnswer}/>}
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
