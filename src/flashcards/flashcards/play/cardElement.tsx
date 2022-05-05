import { getCardData } from "flashcards/flashcards/actions/card/cardData";
import { isNewTerm } from "flashcards/flashcards/actions/card/cardSchedule";
import { answer } from "flashcards/flashcards/actions/session/functions";
import { getDirectionFromCardId } from "flashcards/flashcards/compile/ids";
import { sessionStore } from "flashcards/flashcards/sessionStore";
import { Direction, Rating } from "flashcards/flashcards/types/types";
import { joinClassNames } from "modules/addCssClass";
import { Jsx } from "modules/typescript/jsx";
import React, { Component } from "react";

type Props = { session: sessionStore };
export class CardElement extends Component<Props> {
  isKeyDown: boolean = false;
  state: {
    answer?: Rating;
    clickingOnShowButton?: boolean;
  } = {};
  componentDidMount() {
    this.sound();
    window.addEventListener("keydown", this.checkKey);
    window.addEventListener("keyup", this.keyUp);
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.checkKey);
    window.addEventListener("keyup", this.keyUp);
  }
  // componentDidUpdate(prevProps?: Props) {
  //   const prevCounter = prevProps.session.counter;
  //   const counter = this.props.session.counter;
  //   const prevCard = prevProps?.vocabulary.card;
  //   if (!prevProps || card.counter !== prevCard.counter) {
  //     this.setState({
  //       answer: null,
  //       clickingOnShowButton: null,
  //     });
  //     this.sound();
  //   }
  // }
  keyUp = () => {
    this.isKeyDown = false;
  };
  checkKey = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (this.isKeyDown) return;
    const answered = this.props.session.hasUserAnswered;
    this.isKeyDown = true;
    if (e.keyCode === 32 /* Space */ || e.keyCode === 13 /* Enter */) {
      if (answered) {
        this.answer(Rating.GOOD);
      } else {
        this.show();
      }
      e.preventDefault();
    } else if (
      [49 /* One */, 74 /* J */, 65 /* A */, 37 /* Left */].includes(e.keyCode)
    ) {
      if (answered) {
        this.answer(Rating.BAD);
      } else {
        this.show();
      }
      e.preventDefault();
    } else if (
      [50 /* Two */, 75 /* K */, 83 /* S */, 40 /* Down */].includes(e.keyCode)
    ) {
      if (answered) {
        this.answer(Rating.GOOD);
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
        this.answer(Rating.EASY);
      } else {
        this.show();
      }
      e.preventDefault();
    }
  };
  answer = (
    rating: Rating,
    timeout?: NodeJS.Timeout | false,
    e?: MouseEvent
  ) => {
    e?.stopPropagation();
    if (this.state.answer) return;
    const { session } = this.props;
    if (timeout === false) {
      answer(rating);
    } else {
      this.setState({
        answer: rating,
      });
      setTimeout(() => {
        answer(rating);
      }, 100);
    }
  };
  sound = (answered?: Boolean) => {
    // const { volume } = this.props.vocabulary;
    // const card = props.session.currentCard;
    // if (!card) return;
    // const id = card.getId();
    //
    // if (volume && getSound(id) && (getFrom(id) === Direction.FRONT_TO_BACK || answered)) {
    //   try {
    //     AudioClip.play(
    //       getSound(id).map((s) => getProcessedImageUrl(s + ".mp3", true))
    //     );
    //   } catch (e) {
    //     console.warn(e);
    //   }
    // } else {
    //   AudioClip.pause();
    // }
    // if (process.env.NODE_ENV === "development") {
    //   if (!getSound(id)) {
    //     // window["utter"] && window["utter"].cancel();
    //     window.speechSynthesis.cancel();
    //
    //     let utter = new SpeechSynthesisUtterance();
    //     // window["utter"] = utter;
    //
    //     const is = getCardData(id, "is_formatted");
    //     const en = getCardData(id, "en_formatted");
    //     let lang = getFrom(id) === Direction.FRONT_TO_BACK ? Direction.FRONT_TO_BACK : Direction.BACK_TO_FRONT;
    //     if (answered) {
    //       lang = getFrom(id) !== Direction.FRONT_TO_BACK ? Direction.FRONT_TO_BACK : Direction.BACK_TO_FRONT;
    //     }
    //
    //     if (lang === Direction.FRONT_TO_BACK) {
    //       switch (getDeckName()) {
    //         case "_de":
    //           utter.lang = "de-DE";
    //           break;
    //         case "_es":
    //           utter.lang = "es-ES";
    //           break;
    //         default:
    //           utter.lang = "en-US";
    //       }
    //     } else {
    //       utter.lang = "is-IS";
    //     }
    //
    //     utter.text = getPlaintextFromFormatted(lang === Direction.FRONT_TO_BACK ? is : en);
    //     utter.volume = 0.5;
    //     utter.rate = 0.9;
    //     window.speechSynthesis.speak(utter);
    //   }
    // }
  };
  show = (timeout?: NodeJS.Timeout | false) => {
    if (this.props.session.hasUserAnswered) {
      this.sound(true);
      return;
    }
    if (timeout === false) {
      this.props.session.hasUserAnswered = true;
    } else {
      this.setState({
        clickingOnShowButton: true,
      });
      setTimeout(() => {
        this.props.session.hasUserAnswered = true;
      }, 50);
    }
    this.sound(true);
  };
  render() {
    const volume = this.props.session.volume;
    const answered = this.props.session.hasUserAnswered;
    const cardInSession = this.props.session.currentCard;
    if (!cardInSession) {
      return <div>Unable to create cards. Please report this error.</div>;
    }
    const cardId = cardInSession.id;

    let direction = getDirectionFromCardId(cardId);
    let lemmas: Jsx = getCardData(cardId, "lemmas");
    // let note_regarding_english: Jsx = getCardData(id, "note_regarding_english");
    // let note: Jsx = getCardData(id, "note");
    // let literally: Jsx = getCardData(id, "literally");
    // let example_declension: Jsx = getCardData(id, "example_declension");
    // let pronunciation: Jsx = getCardData(id, "pronunciation");
    // let synonyms: Jsx = getCardData(id, "synonyms");
    const front = getCardData(cardId, "front");
    const back = getCardData(cardId, "back");

    /* Loading */
    if (!front || !back) {
      return null;
    }

    // literally = label("Literally", literally);
    // synonyms = label(withPlural(/,/.test(synonyms), "Synonym"), synonyms);
    // lemmas = label(withPlural(/,/.test(lemmas), "Dictionary form"), lemmas);
    // example_declension = label("Example declension", example_declension);
    // pronunciation = label(
    //   "Pronounced",
    //   pronunciation && `<i>${pronunciation}</i>`
    // );
    // note = label("Note", note);
    // note_regarding_english = label("Note", note_regarding_english);

    const AnswerButton = this.AnswerButton;

    return (
      <div
        className={`
          vocabulary-card
          flashcard
          ${answered ? "answered" : "not-answered"}
          ${"" /*getSound(cardId) && volume ? "has-sound" : ""*/}
          ${isNewTerm(cardId) ? "new" : ""}
        `}
        onClick={() => this.show(false)}
      >
        <div
          className={`
          flashcard-top
          flashcard-prompt-${
            direction === Direction.FRONT_TO_BACK ? "icelandic" : "english"
          }
        `}
        >
          {/*{getSound(cardId) && <div className="has-audio-icon" />}*/}
          <div>
            {html(direction === Direction.FRONT_TO_BACK ? front : back)}
          </div>
        </div>
        <div
          className={`
          flashcard-bottom
          flashcard-prompt-${
            direction !== Direction.FRONT_TO_BACK ? "icelandic" : "english"
          }
        `}
        >
          {(answered ||
            /"occluded/.test(
              direction !== Direction.FRONT_TO_BACK ? front : back
            )) && (
            <div>
              {html(direction !== Direction.FRONT_TO_BACK ? front : back)}
            </div>
          )}
        </div>
        <div className="card-notes">
          <div className="card-notes-inner">
            {/*<div*/}
            {/*  className={*/}
            {/*    direction === Direction.BACK_TO_FRONT ? "" : "show-after-answer"*/}
            {/*  }*/}
            {/*>*/}
            {/*  {note_regarding_english}*/}
            {/*</div>*/}
            {/*<div className="show-after-answer">*/}
            {/*  {note}*/}
            {/*  {literally}*/}
            {/*  {lemmas}*/}
            {/*  {example_declension}*/}
            {/*  {synonyms}*/}
            {/*  {pronunciation}*/}
            {/*</div>*/}
          </div>
        </div>

        <div className="flashcard-buttons">
          {!answered ? (
            <div>
              <button
                type="button"
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
              <AnswerButton
                className="button-bad"
                label="Bad"
                rating={Rating.BAD}
              />
              <AnswerButton
                className="button-good"
                label="Good"
                rating={Rating.GOOD}
              />
              <AnswerButton
                className="button-easy"
                label="Easy"
                rating={Rating.EASY}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
  AnswerButton = ({
    className,
    label,
    rating,
  }: {
    className: string;
    label: string;
    rating: Rating;
  }) => {
    return (
      <button
        type="button"
        className={joinClassNames(
          className,
          "nostyle",
          this.state.answer === rating ? "selected" : ""
        )}
        onClick={() => this.answer(rating, false)}
      >
        {label}
      </button>
    );
  };
}

/**
 * Helper function around dangerouslySetInnerHTML
 */
const html = (text?: string): Jsx => {
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
//   return size - (lang === Direction.BACK_TO_FRONT ? 1 : 0);
// };

const label = (name: string, value: string) => {
  if (!value) return null;
  return (
    <div>
      <span className="label">{name}:</span> {html(value)}
    </div>
  );
};
