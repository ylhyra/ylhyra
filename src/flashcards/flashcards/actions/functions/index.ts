import {
  getCardsInSchedule,
  getTermIds,
} from "flashcards/flashcards/actions/card/cardData";
import { isNewTerm } from "flashcards/flashcards/actions/card/cardSchedule";
import { getCardsFromAllDecks } from "flashcards/flashcards/flashcardsStore";
import { CardId, CardIds, TermId } from "flashcards/flashcards/types/types";
import { getEntireSchedule } from "flashcards/flashcards/userDataStore";
import { isDev } from "modules/isDev";
import { roundToInterval } from "modules/math";

export const printWord = (id: CardId | TermId | string) => {
  throw new Error("Not implemented");
  if (!isDev) return;
  // if (id in getCardsFromAllDecks()) {
  //   return getPlaintextFromFormatted(
  //     getCardData(
  //       id as CardId,
  //       (getDirection(id as CardId) + "_formatted") as
  //         | "is_formatted"
  //         | "en_formatted"
  //     )
  //   );
  //   // return card[card.getFrom() + "_plaintext"];
  // } else if (id in getTermsFromAllDecks()) {
  //   return printWord(getTermsFromAllDecks()[id].cards[0]);
  // } else {
  //   log(`No id ${id}`);
  // }
};

export const studyParticularIds = async (allowedIds: CardIds, options?) => {
  throw new Error("Not implemented");
  // const session = getSession();
  // session.reset();
  // session.allowedIds = allowedIds;
  // createCards(options);
  // initializeSession({ shouldReset: false });
  // goToUrl("/vocabulary/play");
};

export const studyNewTerms = () => {
  const newTerms: CardIds = [];
  (Object.keys(getCardsFromAllDecks()) as CardIds).forEach((id) => {
    if (!(id in getEntireSchedule()) && isNewTerm(id)) {
      newTerms.push(id);
    }
  });
  studyParticularIds(newTerms, {
    skipDependencies: true,
    dontSortByAllowedIds: true,
  });
};

export const countTerms = (ids: CardIds) => {
  const i = rapidFlattenArrayAndCountUnique(ids.map((id) => getTermIds(id)));
  return roundToInterval(i, i > 200 ? 50 : 5);
};

export const rapidCountUnique = (i) => new Set(i).size;
export const rapidFlattenArrayAndCountUnique = (arrOfArrs) => {
  let s = new Set();
  arrOfArrs.forEach((arr) => {
    arr.forEach((i) => {
      s.add(i);
    });
  });
  return s.size;
};

export const countTermsInSchedule = () => {
  return countTerms(getCardsInSchedule());
};

// if (isBrowser && isDev) {
//   window["studyParticularWords"] = async (...words) => {
//     await studyParticularIds(
//       getCardIdsFromTermIds(
//         words.map((i) => getHashForVocabulary(i)) as TermIds
//       )
//     );
//   };
//   window["studyParticularIds"] = studyParticularIds;
// }

export const exitVocabularyScreen = async () => {
  let url = window.location.pathname;
  if (url === "/vocabulary/play" || url === "/vocabulary/difficulty") {
    url = "/vocabulary";
  }
  // goToUrl(url);
};
