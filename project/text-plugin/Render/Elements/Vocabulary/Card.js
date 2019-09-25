import React, { Component } from 'react';
import { connect } from 'react-redux';
import Gender from 'text-plugin/Vocabulary/Types/Gender'
import Multiple from 'text-plugin/Vocabulary/Types/Multiple'
import Flashcard from 'text-plugin/Vocabulary/Types/Flashcard'
import Write from 'text-plugin/Vocabulary/Types/Write'
import DragDrop from 'text-plugin/Vocabulary/Types/DragDrop'
import Listen from 'text-plugin/Vocabulary/Types/Listen'
// import { sound } from 'vocabulary/frontend/src/Elements/Sound/actions'
import { submitAnswer } from 'text-plugin/Vocabulary/actions'

class Card extends Component {
  state = {
    hasAnswered: false,
  }
  // componentDidMount() {
  //   const { card, next } = this.props
  //   if (!card) {
  //     next(null)
  //   } else {
  //     this.sound()
  //   }
  // }
  // componentDidUpdate = () => {
  //   this.sound()
  // }
  // sound = () => {
  //   const { card, sound, answer, index, volume } = this.props
  //   if (!volume || !card.sound || index !== 0) return
  //   if (card.playSound || answer.answered) {
  //     try {
  //       sound(card.sound.trim())
  //     } catch (e) {
  //       console.warn(e)
  //     }
  //   }
  // }
  //
  // componentWillMount() {
  //   window.addEventListener('keydown', this.keydown);
  // }
  // componentWillUnmount() {
  //   window.removeEventListener('keydown', this.keydown);
  // }
  // keydown = (e) => {
  //   const { card, answer, submitAnswer } = this.props
  //   if (card.type === 'write' || card.game === 'listen-and-write') {
  //     return
  //   }
  //   if (card.id !== answer.id) {
  //     return
  //   }
  //   if (
  //     e.keyCode === 83 || // S
  //     e.keyCode === 74 || // J
  //     e.keyCode === 49 // 1
  //   ) {
  //     submitAnswer(0)
  //   } else if (
  //     e.keyCode === 68 || // D
  //     e.keyCode === 75 || // K
  //     e.keyCode === 50 // 2
  //   ) {
  //     submitAnswer(1)
  //   } else if (
  //     e.keyCode === 70 || // F
  //     e.keyCode === 76 || // L
  //     e.keyCode === 51 // 3
  //   ) {
  //     submitAnswer(2)
  //   }
  // }

  render() {
    const { card, answer } = this.props
    if (card) {
      let Type = null
      if (card.type === 'multiple choice') {
        Type = Multiple
      } else if (card.type === 'gender') {
        Type = Gender
      } else if (card.type === 'flashcard') {
        Type = Flashcard
      } else if (card.type === 'listen') {
        Type = Listen
      } else if (card.type === 'write') {
        Type = Write
      } else if (card.type === 'drag and drop words') {
        Type = DragDrop
      } else {
        console.error(card.type + ' - unknown type')
        return null
      }
      // console.log(answer)
      const className = [
        'vocabulary-card',
        card.type?.replace(/( )/g, '-'),
        card.game?.replace(/( )/g, '-'),
        answer.correct && 'correct',
        answer.correct === false && 'incorrect',
      ].filter(Boolean).join(' ')
      return (
        <div className={className} onClick={this.sound}>
          <Type card={card} answer={answer} id={this.props.id}/>
        </div>
      )
    }
    return null
  }
}
export default Card
