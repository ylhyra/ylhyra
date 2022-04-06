import React, { Component } from "react";
import { connect } from "react-redux";
import { withPlural } from "ylhyra/app/app/functions/simplePlural";
import store from "ylhyra/app/app/store";
import {
  getData,
  getFrom,
  getSound,
} from "ylhyra/vocabulary/app/actions/card/card_data";
import { isNewTerm } from "ylhyra/vocabulary/app/actions/card/card_schedule";
import CardInSession from "ylhyra/vocabulary/app/actions/cardInSession";
import { deck } from "ylhyra/vocabulary/app/actions/deck";
import { BAD, EASY, GOOD, rating } from "ylhyra/vocabulary/app/constants";
import { VocabularyReducer } from "ylhyra/vocabulary/app/reducers";
import AudioClip from "ylhyra/content/frontend/audio/audioWithoutInterface.NOT_USED";
import { getPlaintextFromFormatted } from "ylhyra/vocabulary/compiler/parseVocabularyFile/format";
import { getDeckName } from "ylhyra/vocabulary/compiler/parseVocabularyFile/functions";
import { getProcessedImageUrl } from "ylhyra/content/documents/links/format/paths";

class CardElement extends Component<{ vocabulary: VocabularyReducer }> {
  isKeyDown: boolean;
  state: {
    answer?: rating;
    clickingOnShowButton?: boolean;
  } = {};
  componentDidMount() {
    this.componentDidUpdate();
    window.addEventListener("keydown", this.checkKey);
    window.addEventListener("keyup", this.keyUp);
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.checkKey);
    window.addEventListener("keyup", this.keyUp);
  }
  componentDidUpdate(prevProps?) {
    const { card } = this.props.vocabulary;
    const prevCard = prevProps?.vocabulary.card;
    if (!prevProps || card.counter !== prevCard.counter) {
      this.setState({
        answer: null,
        clickingOnShowButton: null,
      });
      this.sound();
    }
  }
  keyUp = () => {
    this.isKeyDown = false;
  };
  checkKey = (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (this.isKeyDown) return;
    const { answered } = this.props.vocabulary.card;
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
    // log(e.keyCode)
  };
  answer = (i, timeout?, e?) => {
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
  sound = (answered?) => {
    const { volume } = this.props.vocabulary;
    const card = deck!.session.currentCard;
    if (!card) return;
    const id = card.getId();

    if (volume && getSound(id) && (getFrom(id) === "is" || answered)) {
      try {
        AudioClip.play(
          getSound(id).map((s) => getProcessedImageUrl(s + ".mp3", true))
        );
      } catch (e) {
        console.warn(e);
      }
    } else {
      AudioClip.pause();
    }

    if (process.env.NODE_ENV === "development") {
      if (!getSound(id)) {
        // window["utter"] && window["utter"].cancel();
        window.speechSynthesis.cancel();

        let utter = new SpeechSynthesisUtterance();
        // window["utter"] = utter;

        const is = getData(id, "is_formatted");
        const en = getData(id, "en_formatted");
        let lang = getFrom(id) === "is" ? "is" : "en";
        if (answered) {
          lang = getFrom(id) !== "is" ? "is" : "en";
        }

        if (lang === "is") {
          switch (getDeckName()) {
            case "_de":
              utter.lang = "de-DE";
              break;
            case "_es":
              utter.lang = "es-ES";
              break;
            default:
              utter.lang = "en-US";
          }
        } else {
          utter.lang = "is-IS";
        }

        utter.text = getPlaintextFromFormatted(lang === "is" ? is : en);
        utter.volume = 0.5;
        utter.rate = 0.9;
        window.speechSynthesis.speak(utter);
      }
    }
  };
  show = (timeout?) => {
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
    const { volume, deck } = this.props.vocabulary;
    const { answered } = this.props.vocabulary.card;
    const card: CardInSession = deck!.session.currentCard;
    if (!card)
      return <div>Unable to create cards. Please report this error.</div>;
    const id = card.getId();

    let from = getFrom(id);
    let lemmas = getData(id, "lemmas");
    let note_regarding_english = getData(id, "note_regarding_english");
    let note = getData(id, "note");
    let literally = getData(id, "literally");
    let example_declension = getData(id, "example_declension");
    let pronunciation = getData(id, "pronunciation");
    let synonyms = getData(id, "synonyms");
    const is = getData(id, "is_formatted");
    const en = getData(id, "en_formatted");

    /* Loading */
    if (!is) {
      return null;
    }

    literally = label("Literally", literally);
    synonyms = label(withPlural(/,/.test(synonyms), "Synonym"), synonyms);
    lemmas = label(withPlural(/,/.test(lemmas), "Dictionary form"), lemmas);
    example_declension = label("Example declension", example_declension);
    pronunciation = label(
      "Pronounced",
      pronunciation && `<i>${pronunciation}</i>`
    );
    note = label("Note", note);
    note_regarding_english = label("Note", note_regarding_english);

    return (
      <div
        className={`
          vocabulary-card
          flashcard
          ${answered ? "answered" : "not-answered"}
          ${getSound(id) && volume ? "has-sound" : ""}
          ${isNewTerm(id) ? "new" : ""}
        `}
        onClick={() => this.show(false)}
      >
        <div
          className={`
          flashcard-top
          flashcard-prompt-${from === "is" ? "icelandic" : "english"}
        `}
        >
          {getSound(id) && <div className="has-audio-icon" />}
          <div>{html(from === "is" ? is : en)}</div>
        </div>
        <div
          className={`
          flashcard-bottom
          flashcard-prompt-${from !== "is" ? "icelandic" : "english"}
        `}
        >
          {(answered || /"occluded/.test(from !== "is" ? is : en)) && (
            <div>{html(from !== "is" ? is : en)}</div>
          )}
        </div>
        <div className="card-notes">
          <div className="card-notes-inner">
            <div className={from === "en" ? "" : "show-after-answer"}>
              {note_regarding_english}
            </div>
            <div className="show-after-answer">
              {note}
              {literally}
              {lemmas}
              {example_declension}
              {synonyms}
              {pronunciation}
            </div>
          </div>

          {/* {cardInSession.counter <= 1 && (
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
export default connect((state: any) => ({
  vocabulary: state.vocabulary,
}))(CardElement);

const html = (text) => {
  if (!text) return null;
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
};

// const getFontSize = (text, lang) => {
//   if (!text) return null;
//   let size = 20;
//   /*if (text.length > 70) {
//     size -= 5;
//   } else if (text.length > 50) {
//     size -= 4;
//   } else */ if (text.length > 40) {
//     size -= 3;
//   } else if (text.length > 25) {
//     size -= 2;
//   }
//   return size - (lang === "en" ? 1 : 0);
// };

const label = (name, value) => {
  if (!value) return null;
  return (
    <div>
      <span className="label">{name}:</span> {html(value)}
    </div>
  );
};
