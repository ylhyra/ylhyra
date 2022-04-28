import { StoreContext } from "flashcards/frontend/store";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { entries } from "modules/typescript/objectEntries";

export const addLine = () => {};

export const FlashcardsEdit = observer(() => {
  let { deckId } = useParams<{ deckId: string }>();
  if (!deckId) throw new Error();
  const store = useContext(StoreContext);
  const deck = store.flashcardStore.getDeck(deckId);

  return (
    <div>
      <h1>{deck.title}</h1>
      <button onClick={addLine}>Add</button>
      <div>
        {entries(deck.cards).map(([cardId, card]) => (
          <div key={card.id}>
            <b>{card.front}</b> – <span>{card.back}</span>
          </div>
        ))}
      </div>
      ;
    </div>
  );
});
