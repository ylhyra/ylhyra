import React, { Component } from 'react';
import { connect } from 'react-redux';
import Answers from 'documents/Render/Elements/Vocabulary/elements/Answers';
import { Word } from 'documents/Render/Elements/Vocabulary/Types/Multiple'
import styled from 'styled-components'
import Emoji from 'documents/Render/Elements/Vocabulary/elements/emoji'

const Button = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
`

class Element extends Component {
  render() {
    let { card, answer } = this.props
    if (!card) return null;
    let { word, word_with_article, english, gender, plural } = card

    /* Temporary, should be moved into template */
    gender = gender.slice(0, 1)
    plural = Boolean(plural)
    card.correct_index = ['m', 'f', 'n'].indexOf(gender)
    // console.log(english)
    // console.log(english.replace(/^(a|an|the) /,''))
    return (
      <div>
        {/* <Pronunciation pronunciation={pronunciation} brackets/> */}
        <div className="prompt-word">
          <div>
            {answer.answered ? (
              <div>
                {addMy(word_with_article, plural, gender)}
              </div>
            ) : (
              word
            )}
            <div className="translation">
              {!answer.answered && english}
              {answer.answered && `my ${english.replace(/^(a|an|the) /,'')}`}
          </div>
          </div>
        </div>
        <Answers vertical submitAnswer={this.props.submitAnswer} answer={answer} card={card}>
          <Button>
            <Emoji gender="masculine" plural={plural} large/>
            {!plural ? 'minn' : 'mínir'}
          </Button>
          <Button>
            <Emoji gender="feminine" plural={plural} large/>
            {!plural ? 'mín' : 'mínar'}
          </Button>
          <Button>
            <Emoji gender="neuter" plural={plural} large/>
            {!plural ? 'mitt' : 'mín'}
          </Button>
        </Answers>
      </div>
    )
  }
}

export default Element

const addMy = (word_with_article, plural, gender) => {
  if (/ (minn|mín|minn|mínir|mínar|mín)$/.test(word_with_article)) {
    return word_with_article
  } else {
    let my
    if (gender === 'm') {
      if (!plural) {
        my = 'minn'
      } else {
        my = 'mínir'
      }
    } else if (gender === 'f') {
      if (!plural) {
        my = 'mín'
      } else {
        my = 'mínar'
      }
    } else if (gender === 'n') {
      if (!plural) {
        my = 'mitt'
      } else {
        my = 'mín'
      }
    }
    return `${word_with_article} ${my}`
  }
}
