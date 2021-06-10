import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'app/App/store'
import Card from './Card'
import { start, close } from './actions'
import Progress from './Progress'
import _ from 'underscore'
import { randomizeOptions } from './randomize'
import { ParseHTMLtoObject } from 'documents/Render/Elements/parse'
require('array-sugar')

class Vocabulary extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this.props)
    let card = this.props.card || ParseHTMLtoObject(props.children)
    card = randomizeOptions(card)
    this.state = {
      card: card,
      answer: {},
    }
    // console.log(card)
  }
  submitAnswer = ({ correct, index }) => {
    const { answer } = this.state
    const { continueGameContainer } = this.props
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
    continueGameContainer && continueGameContainer(correct)
  }
  render() {
    const { card, answer } = this.state
    return (
      <div className="card-outer-container">
        <div className={`card-container ${answer.answered && 'answered'} ${card.notes && 'has-notes'}`}>
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
