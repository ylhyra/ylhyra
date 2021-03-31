import React, { Component } from 'react';
import { connect } from 'react-redux';

class Card extends Component {
  state = {
    hasAnswered: false,
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
  render() {
    const { card, answer, insideConversation } = this.props
    // console.log({card,answer})
    if (card) {
      let Type = null
      return (
        <div className="flashcard-container" onClick={this.props.submitAnswer}>
          <div className="flashcard-top">
            <Prompt card={card}/>
          </div>
          {!answer.answered && (
            <div className="flashcard-bottom not-answered">
              Click to show answer
            </div>
          )}
          {/* {answer.answered && (
            <div className="flashcard-bottom">
              {card.from !== 'is' && (<div>
                <span>{clean(card.icelandic)}</span>
              </div>
              )}
              {card.from !== 'en' && (
                <span className="english">{clean(card.english)}</span>
              )}
            </div>
          )} */}
        </div>
      )
    }
    return null
  }
}
export default Card
