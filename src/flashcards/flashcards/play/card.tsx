import { store } from 'flashcards/store';
import { isDev } from "modules/isDev";
import { isNewRowThatHasNotBeenSeenInSession } from "flashcards/flashcards/actions/card/cardSchedule";
import { nextCard } from "flashcards/flashcards/actions/session/nextCard";
import { EditCard } from "flashcards/flashcards/play/editCard";
import { Direction, Rating } from "flashcards/flashcards/types";
import { observer } from "mobx-react";
import { classNames } from "modules/addCssClass";
import { Jsx } from "modules/typescript/jsx";
import React, { useState, useEffect } from "react";
import { getPlaintextFromFormatted } from "flashcards/flashcards/actions/format/format";
import { useKeyboardListener } from "flashcards/flashcards/play/functions";
import { makeAutoObservable, action } from "mobx";
import { getUserSetting } from "../../user/userSettings.fields";

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

  ratingClicked = (rating: Rating, useTimeout?: boolean) => {
    if (!(rating && this.isShowingBottomSide)) {
      this.cardClicked(useTimeout);
    }
    if (this.chosenRating || !this.isShowingBottomSide) return;
    this.chosenRating = rating;
    setTimeout(
      () => {
        store.session.currentCard?.rate(rating);
      },
      useTimeout ? 100 : 0,
    );
  };

  sound = () => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance();

    if (!getUserSetting("volume")) return;

    const card = store.session.currentCard;
    if (!card) return;
    const front = card.frontFormatted;
    const back = card.backFormatted;

    // TODO: back side

    if (
      (card.direction === Direction.FRONT_TO_BACK &&
        !this.isShowingBottomSide) ||
      (this.isShowingBottomSide &&
        card.direction === Direction.BACK_TO_FRONT) ||
      (this.isShowingBottomSide &&
        !card.row.getSetting("backSideSpeechSynthesis"))
    ) {
      if (
        card.row.getSetting("frontSideSpeechSynthesis") &&
        card.row.getSetting("frontSideLanguage")
      ) {
        utter.lang = card.row.getSetting("frontSideLanguage")!;
        utter.text = getPlaintextFromFormatted(front);
        utter.rate = 0.7;
        utter.volume = isDev ? 0.2 : 0.5;
        window.speechSynthesis.speak(utter);
      }
    } else if (
      card.row.getSetting("backSideSpeechSynthesis") &&
      card.row.getSetting("backSideLanguage")
    ) {
      utter.lang = card.row.getSetting("backSideLanguage")!;
      utter.text = getPlaintextFromFormatted(back);
      utter.rate = 0.7;
      utter.volume = isDev ? 0.2 : 0.5;
      window.speechSynthesis.speak(utter);
    }
  };
}

export const CardElement = observer(() => {
  const [ui] = useState(() => new CardUI());
  useKeyboardListener(ui);
  useEffect(() => ui.sound(), []);

  // useEffect(() => {
  //   void texLinebreakDOM(document.querySelectorAll(".flashcard-prompt > div"), {
  //     align: "center",
  //     infiniteGlueStretchAsRatioOfWidth: 0,
  //     justify: false,
  //   });
  //   /* TODO!! Cleanup */
  // });

  const session = store.session;
  // const isVolumeOn = store.volume;
  const card = session.currentCard;

  if (session.counter === 0) {
    return <div>Loading...</div>;
  }
  if (!card) {
    return <div>Unable to create cards.</div>;
  }

  if (ui.isEditing) {
    return (
      <div className={classNames("flashcard")}>
        <EditCard
          row={card.row}
          done={action(() => {
            ui.isEditing = false;
          })}
        />
      </div>
    );
  }

  /* Loading */
  if (!card.frontFormatted || !card.backFormatted) {
    return null;
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
          onClick={action(() => {
            ui.isEditing = true;
          })}
        >
          Edit
        </button>
      </div>
      <div
        onClick={() => ui.cardClicked()}
        className={classNames(
          "flashcard-prompt",
          "flashcard-top",
          card.direction === Direction.FRONT_TO_BACK
            ? "front-side"
            : "back-side",
        )}
      >
        {/*{getSound(cardId) && <div className="has-audio-icon" />}*/}
        <div>
          {html(
            card.direction === Direction.FRONT_TO_BACK
              ? card.frontFormatted
              : card.backFormatted,
          )}
        </div>
      </div>
      <div
        onClick={() => ui.cardClicked()}
        className={classNames(
          "flashcard-prompt",
          "flashcard-bottom",
          card.direction !== Direction.FRONT_TO_BACK
            ? "front-side"
            : "back-side",
        )}
      >
        {(ui.isShowingBottomSide ||
          /"occluded/.test(
            card.direction !== Direction.FRONT_TO_BACK
              ? card.frontFormatted
              : card.backFormatted,
          )) && (
          <div>
            {html(
              card.direction !== Direction.FRONT_TO_BACK
                ? card.frontFormatted
                : card.backFormatted,
            )}
          </div>
        )}
      </div>
      {ui.isShowingBottomSide && <div>{card.row.data.lemmas}</div>}
      {ui.isShowingBottomSide && <div>{card.row.data.note}</div>}
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
