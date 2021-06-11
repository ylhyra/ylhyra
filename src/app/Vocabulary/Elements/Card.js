import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BAD, OK, PERFECT } from 'app/Vocabulary/actions/card'
import { answer } from 'app/Vocabulary/actions/session'
import store from 'app/App/store'

class Card extends Component {
  state = {}
  componentDidMount() {
    this.componentDidUpdate()
    window.addEventListener('keydown', this.checkKey);
    window.addEventListener('keyup', this.keyUp);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.checkKey);
    window.addEventListener('keyup', this.keyUp);
  }
  componentDidUpdate(prevProps) {
    const { card, status } = this.props.vocabulary
    if (!prevProps || card.counter !== prevProps.vocabulary.card.counter) {
      this.setState({
        answer: null,
        clickingOnShowButton: null,
        // hint: hide(card.from !== 'is' ? card.is : card.en)
      })
    }
  }
  keyUp = () => {
    this.isKeyDown = false
  }
  checkKey = (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (this.isKeyDown) return;
    const { answered } = this.props.vocabulary.card
    // console.log(e.keyCode)
    this.isKeyDown = true
    if (e.keyCode === 32 /* Space */ ) {
      if (answered) {
        this.answer(OK)
      } else {
        this.show()
      }
      e.preventDefault()
    } else if ([49 /* One */ , 74 /* J */ , 65 /* A */ , 37 /* Left */ ].includes(e.keyCode)) {
      if (answered) {
        this.answer(BAD)
      } else {
        this.show()
      }
      e.preventDefault()
    } else if ([50 /* Two */ , 75 /* K */ , 83 /* S */ , 40 /* Down */ ].includes(e.keyCode)) {
      if (answered) {
        this.answer(OK)
      } else {
        this.show()
      }
      e.preventDefault()
    } else if ([51 /* Three */ , 76 /* L */ , 68 /* D */ , 39 /* Right */ ].includes(e.keyCode)) {
      if (answered) {
        this.answer(PERFECT)
      } else {
        this.show()
      }
      e.preventDefault()
    }
    // console.log(e.keyCode)
  }
  answer = (i, timeout) => {
    if (this.state.answer) return;
    if (timeout === false) {
      answer(i)
    } else {
      this.setState({
        answer: i,
      })
      setTimeout(() => {
        answer(i)
      }, 100)
    }
  }
  // componentDidMount() {
  //   this.sound()
  // }
  // componentDidUpdate = () => {
  //   this.sound()
  // }
  // sound = () => {
  //   const { card, answer } = this.props
  //   if (/*!volume ||*/ !card.audio) return
  //   // console.log(card)
  //   if (card.from === 'is' || card.type==='gender' || card.type==='drag and drop' || card.type==='no game' || card.listen || card.play_sound_immediately || answer.answered) {
  //     try {
  //       AudioClip.play(card.audio)
  //      } catch (e) {
  //       console.warn(e)
  //     }
  //   }
  // }
  show = (timeout) => {
    if (this.props.vocabulary.card.answered) return;
    if (timeout === false) {
      store.dispatch({
        type: 'ANSWER_CARD',
      })
    } else {
      this.setState({
        clickingOnShowButton: true,
      })
      setTimeout(() => {
        store.dispatch({
          type: 'ANSWER_CARD',
        })
      }, 50)
    }
  }
  render() {
    const { card, status } = this.props.vocabulary
    const answered = card.answered
    // console.log(card)
    // console.log({card,answer})
    if (!card || !card.is) return null;
    let Type = null
    const is = card.is
    const en = card.en
    return (
      <div className="vocabularynew-vocabulary-card" key={status.counter}>
        <div className="vocabularynew-flashcard-container" onClick={()=>this.show(false)}>
          <div className={`flashcard-top ${card.from === 'is' ? 'icelandic' : 'english'}`}>
            {card.from === 'is' ? is : en}
          </div>
          <div className={`flashcard-bottom ${card.from !== 'is' ? 'icelandic' : 'english'}`}>
            {answered ? (
              card.from !== 'is' ? is : en
            ) : (
              card.showHint && this.state.hint
            )}
          </div>
          {!answered ? (
            <button className={`flashcard-bottom not-answered ${this.state.clickingOnShowButton ? 'selected':''}`}>
              Click to show answer
            </button>
          ) : (
            <div>
              <button className={this.state.answer === BAD ? 'selected':''} onClick={()=>this.answer(BAD,false)}>Bad</button>
              <button className={this.state.answer === OK || !this.state.answer ? 'selected':''} onClick={()=>this.answer(OK,false)}>OK</button>
              <button className={this.state.answer === PERFECT ? 'selected':''} onClick={()=>this.answer(PERFECT,false)}>Perfect</button>
            </div>
          )}
        </div>
      </div>
    )
  }
}
export default connect(state => ({
  vocabulary: state.vocabulary,
}))(Card)


const hide = (input) => {
  if (!input) return null
  if (input.split(' ').length > 2) return null; // Temp
  const output = input.split(/([,;/ ])/g).map(i => {
    if (i.match(/[,;/ ]/)) return i;
    let hintsToShow = Math.min(Math.ceil(Math.random() * 3), i.length - 2)
    // if(i.length <= 2) hintsToShow = 0;
    return i.split('').map((j, index) => {
      if (index >= hintsToShow && !/[.?!:;,]/.test(j)) return `<span class="occulted"><span>${j}</span></span>`;
      return j;
    }).join('')
  }).join('')

  //.replace(/\(/g, '<span className="parentheses">(').replace(/\)/g, ')</span>')
  return (<span dangerouslySetInnerHTML={{__html: output}}/>)
}
