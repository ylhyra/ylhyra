// Hlusta á íslenskt orð -> velja rétta enska þýðingu
// Hlusta á íslenskt orð -> velja rétt íslenskt orð
// Lesa íslenskt orð -> Velja hljóð
// Lesa enskt orð -> Velja hljóð

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Answers from 'Render/Elements/Vocabulary/elements/Answers';
import styled from 'styled-components'
import clean from 'Render/Elements/Vocabulary/functions/clean'
import Write from 'Render/Elements/Vocabulary/functions/Write'

const AudioIcon = styled.div `
  text-align: center;
  flex: 1;
  font-size: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
`

class Element extends Component {
  render() {
    const { card, answer } = this.props
    /*
      Listen and write
    */
    if (card.game === 'listen-and-write') {
      return (
        <div className="flashcard-container">
          <div className="flashcard-top"  onClick={()=>this.refs.write.focus()}>
            <AudioIcon><div>{'🔈'}</div></AudioIcon>
            <small className="small-instructions center">Click to play sound</small>
          </div>
          <div className="flashcard-bottom">
            <div className="small-instructions">
              Write in Icelandic:
            </div>
            <Write card={card} ref="write"/>
          </div>
        </div>
      )
    }
    /*
      Multiple choice
    */
    return (
      <div>
        {/* {answer.answered && <div><Pronunciation pronunciation={card.pronunciation} brackets/></div>} */}
        <AudioIcon><div>{'🔈'}</div></AudioIcon>
        <small className="small-instructions center">Click to play sound</small>

        <Answers answer={answer} id={this.props.id} >
          {card.options && card.options.map(({icelandic, english}, index) => (
            <div key={index}>
              {card.from === 'is' && (
                <div>
                  <div className="icelandic">{clean(icelandic)}</div>
                  {answer.answered && (
                    <div className="english small">{clean(english)}</div>
                  )}
                </div>
              )}
              {card.from === 'en' && (
                <div>
                  <div className="english">{clean(english)}</div>
                  {answer.answered && (
                    <div className="icelandic small">{clean(icelandic)}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </Answers>
      </div>
    )
  }
}

export default Element
