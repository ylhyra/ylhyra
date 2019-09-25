import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import Card from './Card'
import { start, close } from './actions'
import Progress from './Progress'
require('array-sugar')
import { ParseConversationAndReturnElement } from 'text-plugin/Conversation/initialize.js'
import _ from 'underscore'

@connect(state => ({
  open: state.vocabulary.open,
}))
export class VocabularyButton extends React.Component {
  render() {
    return (
      <div className="vocabulary-container">
        {/* <div className="button-container">
          <div className="button blue" onClick={start}>Learn vocabulary</div>
        </div>
        {this.props.open && <Vocabulary id={this.props.id}/>} */}
        <Vocabulary id={this.props.id}/>
      </div>
    )
  }
}

@connect((state, props) => {
  const { id } = props
  const { sections, progress, answers } = state.vocabulary
  const cards = sections[id] || []
  const currentCard = cards[progress[id] || 0]
  // console.log({id,progress,currentCard})
  return {
    card: currentCard,
    cardIndex: progress[id] || 0,
    answer: answers[id] || {},
    progress: progress[id]
  }
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
    const { card } = this.state
    // console.log(card)
    // card && card.content && console.log(ParseConversationAndReturnElement(card.content))
    return (
      <div className="card-outer-container">
        <div className="card-container">

          {card && card.type==='vocabulary' && <div className="vocabulary-card no-padding">{ParseConversationAndReturnElement(card.content, id, cardIndex)}</div> }
          {card && card.type!=='vocabulary' && <Card key={id+'_'+(this.props.progress||0)} id={id} card={card} answer={this.props.answer}/>}
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
          )}
        </div>
        <Progress id={id}/>
      </div>
    )
  }
}
export default Vocabulary

/*
  Randomizes the options for multiple choice cards.
  On the input, the correct value is the first value.
*/
const randomizeOptions = (card) => {
  if (card && card.options && (['multiple choice', 'listen'].includes(card.type))) {
    const numberOfOptions = Math.random() > 0.6 ? 2 : 3
    const correct_index = randomInt(0, numberOfOptions - 1)
    const options = [
      card.options[0],
      ..._.shuffle(card.options.slice(1)).slice(0, numberOfOptions - 1),
    ]
    return {
      ...card,
      correct_index,
      options: [
        ...options.slice(-correct_index),
        ...options.slice(0, -correct_index),
      ]
    }
  }
  return card
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
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
