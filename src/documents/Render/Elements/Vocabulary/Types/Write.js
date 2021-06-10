import React, { Component } from 'react';
import { connect } from 'react-redux';
import Prompt from 'documents/Render/Elements/Vocabulary/Prompt'
import Write from 'documents/Render/Elements/Vocabulary/functions/Write'

class Element extends Component {
  render() {
    const { card, answer } = this.props
    return (
      <div className="flashcard-container">
        <div className="flashcard-top"  onClick={()=>this.refs.write.focus()}>
          {/* {card.listen ? (

                    {(card.listen && !answer.answered) ? null :
                      <Write card={card} ref="write" submitAnswer={this.props.submitAnswer}/>
                    } */}
          <Prompt card={card} no_pronunciation no_icons write={true}/>
        </div>
        <div className="flashcard-bottom">

          {card.listen ? (
            <div>
            </div>
          ) : (
            card.from === 'is' ? (
              <div className="small-instructions">
                Translate to English:
              </div>
            ) : (
              <div className="small-instructions">
                Translate to Icelandic:
              </div>
            )
          )}

          <Write card={card} ref="write" submitAnswer={this.props.submitAnswer}/>
        </div>
      </div>
    )
  }
}
export default Element
