import { Card } from "flashcards/flashcards/actions/card/card";
import { getSession } from "flashcards/flashcards/actions/session/session";
import { ChooseCardsHelper } from "flashcards/flashcards/actions/createCards/wip/chooseCardsHelper";

export const chooseCards = (): Card[] => {
  const session = getSession();

  return new ChooseCardsHelper(session).run();
};
