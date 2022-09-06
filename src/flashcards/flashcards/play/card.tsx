import { isNewRowThatHasNotBeenSeenInSession } from "flashcards/flashcards/actions/card/cardSchedule";
import { nextCard } from "flashcards/flashcards/actions/session/nextCard";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { EditCard } from "flashcards/flashcards/play/editCard";
import { Direction, Rating } from "flashcards/flashcards/types";
import { observer } from "mobx-react";
import { classNames } from "modules/addCssClass";
import { Jsx } from "modules/typescript/jsx";
import React, { useState, useEffect } from "react";
import { getPlaintextFromFormatted } from "flashcards/flashcards/actions/format/format";
import { useKeyboardListener } from "flashcards/flashcards/play/functions";
import { makeAutoObservable, action } from "mobx";

export class CardUI {
  isEditing?: boolean;
  /** First the user clicks the card to show the other side */
  isShowingBottomSide?: boolean;
  /** Then he rates how well he knew it */
  chosenRating?: Rating;
  /** Used to make UI show a slight lag between keyboard shortcuts and answering */
  clickingOnShowButton?: boolean;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * @param useTimeout – A timeout is used when using keyboard shortcuts to add
   *   enough lag to the user interface for which button the user is clicking to
   *   be noticeable
   */
  cardClicked = (useTimeout?: boolean) => {
    if (!this.isShowingBottomSide) {
      if (useTimeout) {
        this.clickingOnShowButton = true;
        setTimeout(
          action(() => {
            this.isShowingBottomSide = true;
            this.sound();
          }),
          50,
        );
      } else {
        this.isShowingBottomSide = true;
        this.sound();
      }
    } else {
      this.sound();
    }
  };

  /** {@link CardElement.cardClicked} is also invoked at the same time (I believe) */
  ratingClicked = (rating: Rating, useTimeout?: boolean) => {
    if (!this.isShowingBottomSide) {
      // todo: do always?
      return this.cardClicked(useTimeout);
    }
    if (this.chosenRating) return;
    // if (useTimeout === false) {
    //   getSession().currentCard?.rate(rating);
    // } else {
    this.chosenRating = rating;
    setTimeout(() => {
      getSession().currentCard?.rate(rating);
    }, 100);
    // }
  };

  sound = () => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance();

    const card = getSession().currentCard;
    if (!card) return;
    const front = card.frontFormatted;

    // TODO: back side

    if (
      card.direction === Direction.FRONT_TO_BACK ||
      this.isShowingBottomSide
    ) {
      if (
        card.row.getSetting("frontSideSpeechSynthesis") &&
        card.row.getSetting("frontSideLanguage")
      ) {
        utter.lang = card.row.getSetting("frontSideLanguage")!;
        utter.text = getPlaintextFromFormatted(front);
        utter.rate = 0.7;
        window.speechSynthesis.speak(utter);
      }
    }
  };
}

export const CardElement = observer(() => {
  const [ui] = useState(() => new CardUI());
  useKeyboardListener(ui);
  useEffect(() => ui.sound(), []);

  // void texLinebreakDOM(document.querySelectorAll(".flashcard-prompt > div"), {
  //   align: "left",
  // });

  const session = getSession();
  // const isVolumeOn = store.volume;
  const card = session.currentCard;

  if (session.counter === 0) {
    return <div>Loading...</div>;
  }
  if (!card) {
    return <div>Unable to create cards.</div>;
  }

  let direction = card.direction;
  const front = card.frontFormatted;
  const back = card.backFormatted;

  /* Loading */
  if (!front || !back) {
    return null;
  }

  if (ui.isEditing) {
    return (
      <div className={classNames("flashcard")}>
        <EditCard
          row={card.row}
          done={() => {
            ui.isEditing = false;
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={classNames(
        "flashcard",
        ui.isShowingBottomSide ? "answered" : "not-answered",
        // "${"" /*getSound(cardId) && volume ? "has-sound" : ""*/}",
        isNewRowThatHasNotBeenSeenInSession(card) && "new",
      )}
    >
      <div>
        <div>{card.row.deck.settings.title}</div>
        <button
          className="btn"
          onClick={() => {
            card.row.data.deleted = true;
            session.cards = session.cards.filter((c) => c.row !== card.row);
            nextCard();
          }}
        >
          Ignore this item
        </button>
        <button
          className="btn"
          onClick={() => {
            if (card.row.data.direction !== "BOTH") {
              card.row.data.direction =
                card.direction === Direction.FRONT_TO_BACK
                  ? "ONLY_BACK_TO_FRONT"
                  : "ONLY_FRONT_TO_BACK";
            } else {
              card.row.data.deleted = true;
            }
            session.cards = session.cards.filter((c) => c !== card);
            nextCard();
          }}
        >
          Ignore this side
        </button>
        <button
          className="btn"
          onClick={() => {
            ui.isEditing = true;
          }}
        >
          Edit
        </button>
      </div>
      <div
        onClick={() => ui.cardClicked()}
        className={classNames(
          "flashcard-prompt",
          "flashcard-top",
          direction === Direction.FRONT_TO_BACK ? "front-side" : "back-side",
        )}
      >
        {/*{getSound(cardId) && <div className="has-audio-icon" />}*/}
        <div>{html(direction === Direction.FRONT_TO_BACK ? front : back)}</div>
      </div>
      <div
        onClick={() => ui.cardClicked()}
        className={classNames(
          "flashcard-prompt",
          "flashcard-bottom",
          direction !== Direction.FRONT_TO_BACK ? "front-side" : "back-side",
        )}
      >
        {(ui.isShowingBottomSide ||
          /"occluded/.test(
            direction !== Direction.FRONT_TO_BACK ? front : back,
          )) && (
          <div>
            {html(direction !== Direction.FRONT_TO_BACK ? front : back)}
          </div>
        )}
      </div>
      <div className="flashcard-buttons">
        {!ui.isShowingBottomSide ? (
          <div>
            <button
              type="button"
              onClick={() => ui.cardClicked()}
              className={`
                not-answered
                button-show-answer
                nostyle
                ${ui.clickingOnShowButton ? "selected" : ""}
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
              ui={ui}
            />
            <AnswerButton
              className="button-good"
              label="Good"
              rating={Rating.GOOD}
              ui={ui}
            />
            <AnswerButton
              className="button-easy"
              label="Easy"
              rating={Rating.EASY}
              ui={ui}
            />
          </div>
        )}
      </div>
    </div>
  );
});

const AnswerButton = ({
  className,
  label,
  rating,
  ui,
}: {
  className: string;
  label: string;
  rating: Rating;
  ui: CardUI;
}) => {
  return (
    <button
      type="button"
      className={classNames(
        className,
        "nostyle",
        ui.chosenRating === rating ? "selected" : "",
      )}
      onClick={() => ui.ratingClicked(rating, false)}
    >
      {label}
    </button>
  );
};

/** Helper function around dangerouslySetInnerHTML */
const html = (text?: string): Jsx => {
  if (!text) return null;
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
};

const label = (name: string, value: string) => {
  if (!value) return null;
  return (
    <div>
      <span className="label">{name}:</span> {html(value)}
    </div>
  );
};
