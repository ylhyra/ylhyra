import React, { Component } from 'react';
import clean from 'text-plugin/Vocabulary/functions/clean'
import Emoji from 'text-plugin/Vocabulary/Types/Gender'

export default ({ card, no_pronunciation, no_icons }) => {
  if (card.table) {
    return <Table table={card.table}/>
  }
  return (
    <div className="prompt-word">
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
    </div>
  )
}
