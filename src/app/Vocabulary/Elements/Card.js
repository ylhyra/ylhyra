import React, { Component } from "react";
import { connect } from "react-redux";
import { BAD, GOOD, EASY } from "app/Vocabulary/actions/card";
import { answer } from "app/Vocabulary/actions/session";
import store from "app/App/store";
import AudioClip from "documents/Render/Audio/AudioClip.js";
import { get_processed_image_url } from "paths";
class Card extends Component {
  state = {};
  componentDidMount() {
    this.componentDidUpdate();
    window.addEventListener("keydown", this.checkKey);
    window.addEventListener("keyup", this.keyUp);
    this.sound();
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.checkKey);
    window.addEventListener("keyup", this.keyUp);
  }
  componentDidUpdate(prevProps, prevState) {
    const { card, status } = this.props.vocabulary;
    const prevCard = prevProps && prevProps.vocabulary.card;
    if (!prevProps || card.counter !== prevCard.counter) {
      this.setState({
        answer: null,
        clickingOnShowButton: null,
        // hint: hide(from !== 'is' ? card.is : card.en)
      });
      this.sound();
    }
    // if (
    //   !prevProps ||
    //   prevCard.id !== card.id ||
    //   this.state.answer !== prevState.answer
    // ) {
    //   console.log(card.sound && card.sound[0].recording_of);
    //
    //   this.sound();
    // }
  }
  keyUp = () => {
    this.isKeyDown = false;
  };
  checkKey = (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (this.isKeyDown) return;
    const { answered } = this.props.vocabulary.card;
    // console.log(e.keyCode)
    this.isKeyDown = true;
    if (e.keyCode === 32 /* Space */ || e.keyCode === 13 /* Enter */) {
      if (answered) {
        this.answer(GOOD);
      } else {
        this.show();
      }
      e.preventDefault();
    } else if (
      [49 /* One */, 74 /* J */, 65 /* A */, 37 /* Left */].includes(e.keyCode)
    ) {
      if (answered) {
        this.answer(BAD);
      } else {
        this.show();
      }
      e.preventDefault();
    } else if (
      [50 /* Two */, 75 /* K */, 83 /* S */, 40 /* Down */].includes(e.keyCode)
    ) {
      if (answered) {
        this.answer(GOOD);
      } else {
        this.show();
      }
      e.preventDefault();
    } else if (
      [51 /* Three */, 76 /* L */, 68 /* D */, 39 /* Right */].includes(
        e.keyCode
      )
    ) {
      if (answered) {
        this.answer(EASY);
      } else {
        this.show();
      }
      e.preventDefault();
    }
    // console.log(e.keyCode)
  };
  answer = (i, timeout) => {
    if (this.state.answer) return;
    if (timeout === false) {
      answer(i);
    } else {
      this.setState({
        answer: i,
      });
      setTimeout(() => {
        answer(i);
      }, 100);
    }
  };
  sound = (answered) => {
    const { card, volume } = this.props.vocabulary;
    if (volume && card.sound && (card.from === "is" || answered)) {
      try {
        // TODO more than one sound
        // TODO repeat
        AudioClip.play(get_processed_image_url(card.sound[0].filename, true));
      } catch (e) {
        console.warn(e);
      }
    } else {
      AudioClip.pause();
    }
  };
  show = (timeout) => {
    if (this.props.vocabulary.card.answered) return;
    if (timeout === false) {
      store.dispatch({
        type: "ANSWER_CARD",
      });
    } else {
      this.setState({
        clickingOnShowButton: true,
      });
      setTimeout(() => {
        store.dispatch({
          type: "ANSWER_CARD",
        });
      }, 50);
    }
    this.sound(true);
  };
  render() {
    const { card, status } = this.props.vocabulary;
    const answered = card.answered;
    // console.log(card)
    // console.log({card,answer})
    if (!card || !card.is) return null;
    let { from, basic_form, note_bfr_show, note_after_show, literally } = card;
    let Type = null;
    const is = card.is_formatted;
    const en = card.en;

    let note_above = null;
    let note_below = null;

    literally = literally && (
      <div>
        <b>Literally:</b> {html(literally)}{" "}
      </div>
    );
    basic_form = basic_form && (
      <div>
        <b>Basic form:</b> {html(basic_form)}{" "}
      </div>
    );
    note_after_show = html(note_after_show);
    note_bfr_show = html(note_bfr_show);

    if (from === "is") {
      note_above = <div className="note show-after-answer">{basic_form}</div>;
      note_below = (
        <div className="note" key={2}>
          {literally}
          {(note_after_show || note_bfr_show) && (
            <div>
              <b>Note:</b> {note_after_show || note_bfr_show}{" "}
            </div>
          )}
        </div>
      );
    } else {
      note_above = (
        <div className="note">
          {note_bfr_show && (
            <div>
              <b>Note:</b> {note_bfr_show}{" "}
            </div>
          )}
        </div>
      );
      note_below = (
        <div className="note" key={2}>
          {note_after_show && (
            <div>
              <b>Note:</b> {note_after_show}{" "}
            </div>
          )}
          {literally}
          {basic_form}
        </div>
      );
    }

    return (
      <div
        className={`
          vocabulary-card
          flashcard
          ${answered ? "answered" : "not-answered"}
        `}
        key={status.counter}
        onClick={() => this.show(false)}
      >
        <div
          className={`
          flashcard-top
          flashcard-prompt-${from === "is" ? "icelandic" : "english"}
        `}
        >
          <div>{html(from === "is" ? is : en)}</div>
          {note_above}
        </div>
        <div
          className={`
          flashcard-bottom
          flashcard-prompt-${from !== "is" ? "icelandic" : "english"}
        `}
        >
          {answered
            ? [<div key={1}>{html(from !== "is" ? is : en)}</div>, note_below]
            : card.showHint && this.state.hint}

          {card.counter <= 1 && (
            <div className="rate-how-well">Rate how well you knew this:</div>
          )}
        </div>

        <div className="flashcard-buttons">
          {!answered ? (
            <div>
              <button
                className={`
              not-answered
              button-show-answer
              nostyle 
              ${this.state.clickingOnShowButton ? "selected" : ""}
            `}
              >
                Click to show answer
              </button>
            </div>
          ) : (
            <div>
              <button
                className={
                  "button-bad nostyle " +
                  (this.state.answer === BAD ? "selected" : "")
                }
                onClick={() => this.answer(BAD, false)}
              >
                Bad
              </button>
              <button
                className={
                  "button-good nostyle " +
                  (this.state.answer === GOOD ? "selected" : "")
                }
                onClick={() => this.answer(GOOD, false)}
              >
                Good
              </button>
              <button
                className={
                  "button-easy nostyle " +
                  (this.state.answer === EASY ? "selected" : "")
                }
                onClick={() => this.answer(EASY, false)}
              >
                Easy
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
}))(Card);

const hide = (input) => {
  if (!input) return null;
  if (input.split(" ").length > 2) return null; // Temp
  const output = input
    .split(/([,;/ ])/g)
    .map((i) => {
      if (i.match(/[,;/ ]/)) return i;
      let hintsToShow = Math.min(Math.ceil(Math.random() * 3), i.length - 2);
      // if(i.length <= 2) hintsToShow = 0;
      return i
        .split("")
        .map((j, index) => {
          if (index >= hintsToShow && !/[.?!:;,]/.test(j))
            return `<span class="occluded"><span>${j}</span></span>`;
          return j;
        })
        .join("");
    })
    .join("");

  return html(output);
};

const html = (text) => {
  if (!text) return null;
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
};
