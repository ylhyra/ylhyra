import { getFrom } from "flashcards/flashcards/play/actions/card/card_data";
import { isBad } from "flashcards/flashcards/play/actions/card/card_difficulty";
import { getSessionsSeen } from "flashcards/flashcards/play/actions/card/card_schedule";
import { addRelatedCardsToSession } from "flashcards/flashcards/play/actions/cardInSession/addRelatedCardsToSession";
import CardInSession from "flashcards/flashcards/play/actions/cardInSession/index";
import { BAD, EASY, GOOD } from "ylhyra/vocabulary/app/constants";

export function rate(this: CardInSession, rating) {
  const card: CardInSession = this;
  const id = card.getId();
  const timesSeenBeforeInSession = card.history.length;
  card.history.unshift(rating);
  card.session.ratingHistory.unshift(rating);
  card.session.cardHistory.unshift(card);
  card.lastSeen = card.session.counter;
  const lastRating = card.history[1];
  const nextLastRating = card.history[2];
  let interval;

  if (rating === BAD) {
    interval = getSessionsSeen(id) > 0 ? 4 : 3;

    /* Two bad ratings in a row */
    if (lastRating === BAD) {
      interval = 3;
      // Three bad ratings in a row always get an interval of 2
      if (nextLastRating === BAD) {
        interval = 2;
      }
      // But two bad ratings in a row also occasionally get an interval of 2
      else if (Math.random() < 0.2) {
        interval = 2;
      }
    }

    /* User is getting annoyed */
    if (timesSeenBeforeInSession >= 6 && timesSeenBeforeInSession % 2 === 0) {
      interval = 8;
    }

    card.done = false;
  } else if (rating === GOOD) {
    interval = 200;
    card.done = true;
    if (lastRating === BAD) {
      interval = 5;
      card.done = false;
    } else if (nextLastRating === BAD) {
      interval = 10;
    } else if (isBad(id) && timesSeenBeforeInSession === 0) {
      interval = 12;
    }
  } else if (rating === EASY) {
    interval = 800;
    card.done = true;
  }

  if (rating === BAD) {
    addRelatedCardsToSession(card);
  }

  card.showIn({ interval });
  card.postponeRelatedCards(interval);
  card.session.cardTypeLog.unshift(getFrom(id));

  // keepTrackOfEasiness({
  //   rating,
  //   isANewCard: !isInSchedule(id) && timesSeenBeforeInSession === 0,
  //   card,
  // });
}
