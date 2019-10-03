import React, { Component } from 'react';
import clean from 'Render/Elements/Vocabulary/functions/clean'
import Emoji from 'Render/Elements/Vocabulary/Types/Gender'

export default ({ card, answer }) => {
  console.log(card)
  return (
    <div className="prompt-word">
      {card.listen && (
        <div>
          <div>{'🔈'}</div>
          <small className="small-instructions center">Click to play sound</small>
        </div>
      )}

      {card.hint && <div>
        {answer&&answer.answered ? card.icelandic : card.hint}
      </div>}

      {(card.from === 'en' || card.show_english) ? (
        <span className={`english ${card.hint ?'small':''}`}>{clean(card.english)}</span>
      ) : (
        <div className="flexWord">
          <div className="icelandic bottom">
            <div>{clean(card.icelandic)}</div>
          </div>
        </div>
      )}

      {card.instructions && <div className="instructions">{card.instructions}</div>}
    </div>
  )
}


// <div className="top">
//   {/* {!no_icons && <Emoji inli ne very_small {...card.icelandic}/>} */}
//   {/* {!no_pronunciation && <Pronunciation pronunciation={card.pronunciation} brackets/>} */}
// </div>
