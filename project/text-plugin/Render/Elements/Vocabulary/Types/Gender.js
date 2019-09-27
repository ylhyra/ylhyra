import React, { Component } from 'react';
import { connect } from 'react-redux';
import Answers from 'Render/Elements/Vocabulary/elements/Answers';
import { Word } from 'Render/Elements/Vocabulary/Types/Multiple'
import styled from 'styled-components'
import Emoji from 'Render/Elements/Vocabulary/elements/emoji'

const Button = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
`

class Element extends Component {
  render() {
    const { card, answer } = this.props
    if(!card) return null;
    const { icelandic, english } = card
    return (
      <div>
        {/* <Pronunciation pronunciation={card.pronunciation} brackets/> */}
        <div className="prompt-word">
          <div>
            {answer.answered ? (
              <div>
                {icelandic.word_with_article}
                {icelandic.gender === 'm' && (!icelandic.plural ? ' minn' : ' mínir')}
                {icelandic.gender === 'f' && (!icelandic.plural ? ' mín' : ' mínar')}
                {icelandic.gender === 'n' && (!icelandic.plural ? ' mitt' : ' mín')}
              </div>
            ) : (
              icelandic
            )}
            <div className="translation">{english}</div>
          </div>
        </div>
        <Answers vertical answer={answer} card={card}>
          <Button>
            <Emoji gender="m" plural={icelandic.plural}/>
            {!icelandic.plural ? 'minn' : 'mínir'}
          </Button>
          <Button>
            <Emoji gender="f" plural={icelandic.plural}/>
            {!icelandic.plural ? 'mín' : 'mínar'}
          </Button>
          <Button>
            <Emoji gender="n" plural={icelandic.plural}/>
            {!icelandic.plural ? 'mitt' : 'mín'}
          </Button>
        </Answers>
      </div>
    )
  }
}

export default Element
