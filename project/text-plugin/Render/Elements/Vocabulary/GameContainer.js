import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ParseHTMLtoArray } from 'Render/Elements/parse'
import Vocabulary from 'Render/Elements/Vocabulary'
import Progress from 'Render/Elements/Vocabulary/Progress'
import _ from 'underscore'

class GameContainer extends Component {
  constructor(props) {
    super(props);
    const cards = ParseHTMLtoArray(this.props.children)
    // console.log(cards[0])
    this.state = {
      cards: _.shuffle(cards),
      currentIndex: 0,
      correctCount: 0,
      incorrectCount: 0,
    }
  }
  continueGameContainer = (correct) => {
    if (correct) {
      this.setState({
        correctCount: this.state.correctCount + 1
      })
    } else {
      this.setState({
        incorrectCount: this.state.incorrectCount + 1
      })
    }
    setTimeout(() => {
      this.setState({
        currentIndex: this.state.currentIndex + 1
      })
    }, 1500)
  }
  render() {
    const { cards, currentIndex, correctCount, incorrectCount } = this.state
    if (!cards) return null;
    // console.log(this.state)
    // console.log(cards[currentIndex])
    return (
      <div>
        {cards[currentIndex]
          ? <Vocabulary key={currentIndex} card={cards[currentIndex]} continueGameContainer={this.continueGameContainer}/>
          : 'Done :)'
        }
        <Progress correctCount={correctCount} incorrectCount={incorrectCount} total={cards.length}/>
      </div>
    )
  }
}
export default GameContainer
