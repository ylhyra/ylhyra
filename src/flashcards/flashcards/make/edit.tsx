import { StoreContext } from "flashcards/frontend/store";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useParams } from "react-router-dom";

export const FlashcardsEdit = observer(() => {
  let { deckId } = useParams<{ deckId: string }>();
  const store = useContext(StoreContext);
  const deck = store.flashcardStore.decks[deckId!]!;

  return <div></div>;
});
