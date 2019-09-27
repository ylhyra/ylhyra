import React, { Component } from 'react';
import { connect } from 'react-redux';
import Prompt from 'Render/Elements/Vocabulary/elements/Prompt'
import Write from 'Render/Elements/Vocabulary/functions/Write'

class Element extends Component {
  render() {
    const { card } = this.props
    return (
      <div className="flashcard-container">
        <div className="flashcard-top"  onClick={()=>this.refs.write.focus()}>
          <Prompt card={card} no_pronunciation no_icons/>
        </div>
        <div className="flashcard-bottom">

          {card.from === 'is' ? (
            <div className="small-instructions">
              Translate to English:
            </div>
          ) : (
            <div className="small-instructions">
              Translate to Icelandic:
            </div>
          )}

          <Write card={card} ref="write" id={this.props.id} />
        </div>
      </div>
    )
  }
}
export default Element
