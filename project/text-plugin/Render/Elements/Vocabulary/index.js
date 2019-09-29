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
import { ParseHTMLtoObject } from 'Render/Elements/parse'

class Vocabulary extends React.Component {
  constructor(props) {
    super(props);
    let card = ParseHTMLtoObject(props.children)
    card = randomizeOptions(card)
    this.state = {
      card: card,
      answer: {},
    }
    // console.log(card)
  }
  submitAnswer = ({ correct, index }) => {
    const { answer } = this.state
    if (answer.answered) {
      return null
    }
    this.setState({
      answer: {
        correct,
        selected_index: index,
        answered: true,
      }
    })
  }
  render() {
    const { card, answer } = this.state
    return (
      <div className="card-outer-container">
        <div className="card-container">
          <Card card={card} answer={answer} submitAnswer={this.submitAnswer}/>
        </div>
      </div>
    )
  }
}
export default Vocabulary

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
