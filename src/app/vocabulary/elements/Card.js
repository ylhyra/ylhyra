import store from "app/app/store";
import { BAD, EASY, GOOD } from "app/vocabulary/actions/card";
import AudioClip from "documents/render/audio/AudioClip";
import { getPlaintextFromFormatted } from "maker/vocabulary_maker/functions";
import { get_processed_image_url } from "paths";
import React, { Component } from "react";
import { connect } from "react-redux";
class Card extends Component {
  state = {};
  componentDidMount() {
    this.componentDidUpdate();
    window.addEventListener("keydown", this.checkKey);
    window.addEventListener("keyup", this.keyUp);
    // this.sound();
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.checkKey);
    window.addEventListener("keyup", this.keyUp);
  }
  componentDidUpdate(prevProps) {
    const { card } = this.props.vocabulary;
    const prevCard = prevProps?.vocabulary.card;
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
  answer = (i, timeout, e) => {
    e?.stopPropagation();
    if (this.state.answer) return;
    const { session } = this.props.vocabulary.deck;
    if (timeout === false) {
      session.answer(i);
    } else {
      this.setState({
        answer: i,
      });
      setTimeout(() => {
        session.answer(i);
      }, 100);
    }
  };
  sound = (answered) => {
    const { card, volume } = this.props.vocabulary;
    if (volume && card.sound && (card.from === "is" || answered)) {
      try {
        AudioClip.play(
          card.sound.map((s) => get_processed_image_url(s + ".mp3", true))
        );
      } catch (e) {
        console.warn(e);
      }
    } else {
      AudioClip.pause();
    }
  };
  show = (timeout) => {
    if (this.props.vocabulary.card.answered) {
      this.sound(true);
      return;
    }
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
    const { card, volume, deck } = this.props.vocabulary;
    const { answered } = card;
    // console.log(card)
    // console.log({card,answer})
    if (!card)
      return <div>Unable to create cards. Please report this error.</div>;
    let {
      from,
      lemmas,
      note_regarding_english,
      note,
      literally,
      example_declension,
      pronunciation,
    } = card;
    const is = card.is_formatted;
    const en = card.en_formatted;

    literally = literally && (
      <div>
        <span className="label">Literally:</span> {html(literally)}
      </div>
    );
    lemmas = lemmas && (
      <div>
        <span className="label">Dictionary form{/,/.test(lemmas) && "s"}:</span>{" "}
        {html(lemmas)}
      </div>
    );
    example_declension = example_declension && (
      <div>
        <span className="label">Example inflection:</span>{" "}
        {html(example_declension)}
      </div>
    );
    note_regarding_english = html(note_regarding_english);
    note = html(note);
    const isNew = deck.session.currentCard?.isNewTerm();
    return (
      <div
        className={`
          vocabulary-card
          flashcard
          ${answered ? "answered" : "not-answered"}
          ${card.sound && volume ? "has-sound" : ""}
          ${isNew ? "new" : ""}
        `}
        // key={status.counter}
        onClick={() => this.show(false)}
      >
        <div
          className={`
          flashcard-top
          flashcard-prompt-${from === "is" ? "icelandic" : "english"}
        `}
        >
          {card.sound && <div className="has-audio-icon" />}
          <div
            style={{
              fontSize: getFontSize(
                getPlaintextFromFormatted(
                  from === "is" ? card.is_plaintext : card.en_plaintext
                ),
                from === "is" ? "is" : "en"
              ),
            }}
          >
            {html(from === "is" ? is : en)}
          </div>
          {/* {note_above} */}
        </div>
        <div
          className={`
          flashcard-bottom
          flashcard-prompt-${from !== "is" ? "icelandic" : "english"}
        `}
        >
          {answered || /"occluded/.test(from !== "is" ? is : en)
            ? [
                <div
                  key={1}
                  style={{
                    fontSize: getFontSize(
                      from !== "is" ? card.is_plaintext : card.en_plaintext,
                      from !== "is" ? "is" : "en"
                    ),
                  }}
                >
                  {html(from !== "is" ? is : en)}
                </div> /*note_below*/,
              ]
            : card.showHint && this.state.hint}
        </div>
        <div className="card-notes">
          <div className="card-notes-inner">
            {note_regarding_english && (
              <div className={from === "en" ? "" : "show-after-answer"}>
                <span className="label">Note:</span> {note_regarding_english}
              </div>
            )}
            <div className="show-after-answer">
              {note && (
                <div>
                  <span className="label">Note:</span> {note}
                </div>
              )}
              {literally}
              {lemmas}
              {example_declension}
              {pronunciation && (
                <div>
                  <span className="label">Pronounced:</span>{" "}
                  <i>{pronunciation}</i>
                </div>
              )}
            </div>
          </div>

          {/* {card.counter <= 1 && (
            <div className="rate-how-well">Rate how well you knew this:</div>
          )} */}
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
                onClick={(e) => this.answer(BAD, false, e)}
              >
                Bad
              </button>
              <button
                className={
                  "button-good nostyle " +
                  (this.state.answer === GOOD ? "selected" : "")
                }
                onClick={(e) => this.answer(GOOD, false, e)}
              >
                Good
              </button>
              <button
                className={
                  "button-easy nostyle " +
                  (this.state.answer === EASY ? "selected" : "")
                }
                onClick={(e) => this.answer(EASY, false, e)}
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

const html = (text) => {
  if (!text) return null;
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
};

const getFontSize = (text, lang) => {
  if (!text) return null;
  let size = 20;
  if (text.length > 70) {
    size -= 5;
  } else if (text.length > 50) {
    size -= 4;
  } else if (text.length > 40) {
    size -= 3;
  } else if (text.length > 25) {
    size -= 2;
  }
  return size - (lang === "en" ? 1 : 0);
};
