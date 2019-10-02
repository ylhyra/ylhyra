import React, { Component } from 'react';
import clean from 'Render/Elements/Vocabulary/functions/clean'
import Emoji from 'Render/Elements/Vocabulary/Types/Gender'

export default ({ card, no_pronunciation, no_icons }) => {
  // console.log(card)
  return (
    <div className="prompt-word">
      {card.prompt && (
        <div>
          <div>{'🔈'}</div>
          <small className="small-instructions center">Click to play sound</small>
        </div>
      )}

      {card.from === 'en' ? (
        <span className="english">{clean(card.english)}</span>
      ) : (
        <div className="flexWord">
          <div className="top">
            {!no_icons && <Emoji inline very_small {...card.icelandic}/>}
            {/* {!no_pronunciation && <Pronunciation pronunciation={card.pronunciation} brackets/>} */}
          </div>
          <div className="icelandic bottom">
            <div>{clean(card.icelandic)}</div>
          </div>
        </div>
      )}

      {card.instructions && <div className="instructions">{card.instructions}</div>}
    </div>
  )
}
