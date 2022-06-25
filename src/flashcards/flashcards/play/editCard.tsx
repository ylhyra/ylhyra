import { CardInSession } from "flashcards/flashcards/actions/cardInSession";
import { EditRow } from "flashcards/flashcards/editor/row";

export function EditCard(cardInSession: CardInSession) {
  return EditRow({ row: cardInSession.row });
}
