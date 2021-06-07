import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ParseHTMLtoArray } from 'User/Render/Elements/parse'
import Vocabulary from 'User/Render/Elements/Vocabulary'
import Progress from 'User/Render/Elements/Vocabulary/Progress'
import _ from 'underscore'

class GameContainer extends Component {
  constructor(props) {
    super(props);
    const cards = ParseHTMLtoArray(this.props.children)
    const shuffle = this.props['data-shuffle'] === 'yes'
    // console.log(cards[0])
    // console.log(cards)
    this.state = {
      cards: shuffle ? _.shuffle(cards) : cards,
      currentIndex: 0,
      /* Stores { index: correct } */
      done: {},
    }
  }
  continueGameContainer = (correct) => {
    this.setState({
      done: {
        ...this.state.done,
        [this.state.currentIndex]: correct,
      }
    })
    // setTimeout(() => {
    //   this.setState({
    //     currentIndex: this.state.currentIndex + 1,
    //   })
    // }, 2000)
  }
  restart = () => {
    this.setState({
      cards: _.shuffle(this.state.cards),
      currentIndex: 0,
      correctCount: 0,
      incorrectCount: 0,
      incorrectArray: [],
    })
  }
  previous = () => {
    if (this.state.currentIndex > 0) {
      this.setState({
        currentIndex: this.state.currentIndex - 1,
      })
    }
  }
  next = () => {
    if (this.state.currentIndex < this.state.cards.length) {
      this.setState({
        currentIndex: this.state.currentIndex + 1,
      })
    }
  }
  render() {
    const { cards, currentIndex } = this.state
    if (!cards) return null;
    // console.log(this.state)
    // console.log(cards[currentIndex])
    let correctCount = 0
    let incorrectCount = 0
    Object.keys(this.state.done).forEach(key => {
      const correct = this.state.done[key]
      if (correct === true) {
        correctCount++
      } else if (correct === false) {
        incorrectCount++
      }
    })

    return (
      <div>
        {cards[currentIndex]
          ? <Vocabulary key={currentIndex} card={cards[currentIndex]} continueGameContainer={this.continueGameContainer}/>
          : <div className="card-outer-container">
              <div>Done {'☺️'}</div>
              <ul><li>{correctCount} correct</li><li>{incorrectCount} incorrect</li></ul>
              <button className="button" onClick={this.restart}>Repeat</button>
            </div>
        }
        <div>
          <a className="button" onClick={this.previous}>Previous</a>
          <a className="button" onClick={this.next}>Next</a>
        </div>
        <Progress
          correctCount={correctCount}
          incorrectCount={incorrectCount}
          currentIndex={currentIndex}
          total={cards.length}
        />
      </div>
    )
  }
}
export default GameContainer
