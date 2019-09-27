import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import Card from './Card'
import { start, close } from './actions'
import Progress from './Progress'
require('array-sugar')
import _ from 'underscore'
import { randomizeOptions } from './randomize'

// @connect(state => ({
//   open: state.vocabulary.open,
// }))
// export class VocabularyButton extends React.Component {
//   render() {
//     return (
//       <div className="vocabulary-container">
//         {/* <div className="button-container">
//           <div className="button blue" onClick={start}>Learn vocabulary</div>
//         </div>
//         {this.props.open && <Vocabulary id={this.props.id}/>} */}
//         <Vocabulary id={this.props.id}/>
//       </div>
//     )
//   }
// }

@connect((state, props) => {
  // const { id } = props
  // const { sections, progress, answers } = state.vocabulary
  // const cards = sections[id] || []
  // const currentCard = cards[progress[id] || 0]
  // // console.log({id,progress,currentCard})
  // return {
  //   card: currentCard,
  //   cardIndex: progress[id] || 0,
  //   answer: answers[id] || {},
  //   progress: progress[id]
  // }
})
class Vocabulary extends React.Component {
  state = {}
  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('---')
  //   console.log(this.props.card)
  //   console.log(nextProps.card)
  //   return this.props.card !== nextProps.card || (this.props.card === nextProps.card && this.props.answer !== nextProps.answer)
  // }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { card } = this.props
    if (prevProps.card !== card && !card) {
      this.setState({ card: null })
    } else if (prevProps.card !== card) {
      this.setState({
        card: randomizeOptions(card)
      })
    }
  }
  render() {
    const { id, cardIndex } = this.props
    // const { card } = this.state
    // console.log(card)
    // card && card.content && console.log(ParseConversationAndReturnElement(card.content))
    return (
      <div className="card-outer-container">
        <div className="card-container">

          {/* {card && card.type==='vocabulary' && <div className="vocabulary-card no-padding">{ParseConversationAndReturnElement(card.content, id, cardIndex)}</div> } */}
          {/* {card && card.type!=='vocabulary' && <Card key={id+'_'+(this.props.progress||0)} id={id} card={card} answer={this.props.answer}/>}
          {!card && (
            <div className="button-container center">
              <div className="button blue" onClick={()=>{
                store.dispatch({
                  type: 'RESET',
                  section_id: id,
                })
              }}>
                Replay
              </div>
            </div>
          )} */}
        </div>
        <Progress id={id}/>
      </div>
    )
  }
}
export default Vocabulary

/*
  Find .me & .them
*/
const Parse = (children) => {
  let output = []
  const Traverse = (input) => {
    if (Array.isArray(input)) {
      input.forEach(Traverse)
    } else if (typeof input === 'object' || typeof input === 'function') {
      if (input.type === 'ul' || input.type === 'li') {
        Traverse(input.props.children)
      } else if (input.props.className === 'them' || input.props.className === 'me') {
        output.push({
          type: 'message',
          from: input.props.className,
          message: input.props.children
        })
      } else {
        console.warn({
          message: 'Unused in Parse()',
          input
        })
      }
    }
  }
  Traverse(children)
  // console.log(output)
  return output
}


// const cards = [
//
//   /* Drag and drop words */
//   {
//     id: 123,
//     type: 'drag and drop words',
//     from: 'en',
//     to: 'is',
//     english: 'How are you?',
//     icelandic: 'Hvað [segir] þú [gott]?',
//     options: [
//       { icelandic: 'segir' },
//       { icelandic: 'gott' },
//       { icelandic: 'þyrstur' },
//       { icelandic: 'takk' },
//     ]
//   },
//   /* Multiple choice */
//   {
//     id: 123,
//     type: 'multiple choice',
//     from: 'en',
//     to: 'is',
//     english: 'How are you?',
//     icelandic: 'Hvað [segir] þú [gott]?',
//     correct_index: 2,
//     options: [
//       { icelandic: 'segir', english: null },
//       { icelandic: 'gott', english: null },
//       { icelandic: 'þyrstur', english: null },
//       { icelandic: 'takk', english: null },
//     ]
//   },
// ]
