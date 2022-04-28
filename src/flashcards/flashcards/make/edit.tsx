import { StoreContext } from "flashcards/frontend/store";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { entries } from "modules/typescript/objectEntries";

export const FlashcardsEdit = observer(() => {
  let { deckId } = useParams<{ deckId: string }>();
  if (!deckId) throw new Error();
  const store = useContext(StoreContext);
  const deck = store.flashcardStore.getDeck(deckId);

  return (
    <div>
      <h1>{deck.title}</h1>
      {entries(deck.cards).map(([cardId, card]) => (
        <div key={card.id}>
          <h2>{card.front}</h2>
          <h2>{card.back}</h2>
        </div>
      ))}
      ;
    </div>
  );
});
