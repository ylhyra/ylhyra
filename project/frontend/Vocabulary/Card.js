import React, { Component } from 'react';
import { connect } from 'react-redux';
import clean from 'Render/Elements/Vocabulary/functions/clean'
import { answer, BAD, OK, PERFECT } from './actions'
import store from 'App/store'

@connect(state => ({
  vocabulary: state.vocabulary,
}))
class Card extends Component {
  state = {}

  UNSAFE_componentWillMount() {
    window.addEventListener('keydown', this.checkKey);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.checkKey);
  }
  checkKey = (e) => {
    const { answered } = this.props.vocabulary.card
    if (e.keyCode === 32 /* Space */ ) {
      if (answered) {
        answer(OK)
      } else {
        this.show()
      }
      e.preventDefault()
    } else if (e.keyCode === 49 /* One */ ) {
      if (answered) {
        answer(BAD)
      } else {
        this.show()
      }
    } else if (e.keyCode === 50 /* Two */ ) {
      if (answered) {
        answer(OK)
      } else {
        this.show()
      }
    } else if (e.keyCode === 51 /* Three */ ) {
      if (answered) {
        answer(PERFECT)
      } else {
        this.show()
      }
    }
    // console.log(e.keyCode)
  }
  // componentDidMount() {
  //   this.sound()
  // }
  // componentDidUpdate = () => {
  //   this.sound()
  // }
  // sound = () => {
  //   const { card, answer } = this.props
  //   if (/*!volume ||*/ !card.audio) return
  //   // console.log(card)
  //   if (card.from === 'is' || card.type==='gender' || card.type==='drag and drop' || card.type==='no game' || card.listen || card.play_sound_immediately || answer.answered) {
  //     try {
  //       AudioClip.play(card.audio)
  //      } catch (e) {
  //       console.warn(e)
  //     }
  //   }
  // }
  show = () => {
    if (this.props.vocabulary.card.answered) return;
    store.dispatch({
      type: 'ANSWER_CARD',
    })
  }
  render() {
    const { card } = this.props.vocabulary
    const answered = card.answered
    // console.log({card,answer})
    if (!card) return null;
    let Type = null
    const is = <div className="icelandic">{clean(card.is)}</div>
    const en = <div className="english">{clean(card.en)}</div>
    return (
      <div className="vocabularynew-vocabulary-card" key={card.id}>
        <div className="vocabularynew-flashcard-container" onClick={this.show}>
          <div className="flashcard-top">
            {card.from === 'is' ? is : en}
          </div>
          <div className="flashcard-bottom">
            {answered && (
              card.from !== 'is' ? is : en
            )}
          </div>
          {!answered ? (
            <button className="flashcard-bottom not-answered">
              Click to show answer
            </button>
          ) : (
            <div>
              <button onClick={()=>answer(BAD)}>Bad</button>
              <button onClick={()=>answer(OK)}>OK</button>
              <button onClick={()=>answer(PERFECT)}>Perfect</button>
            </div>
          )}
        </div>
      </div>
    )
  }
}
export default Card
