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
  constructor(props) {
    super(props);
    // console.log(this.props['data-name'] === "multiple choice is en")
    let card = ParseHTMLtoObject(props.children)
    card.type = this.props['data-game']
    card['full-name'] = this.props['data-game-full-name']
    card = randomizeOptions(card)
    this.state = {
      card,
    }
    // console.log(JSON.stringify(ParseHTMLtoObject(props.children),null,2))
  }
  render() {
    const { id, cardIndex } = this.props
    const { card } = this.state
    // console.log(card)
    // card && card.content && console.log(ParseConversationAndReturnElement(card.content))
    return (
      <Card card={card}/>
    )
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
        {/* <Progress id={id}/> */}
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
