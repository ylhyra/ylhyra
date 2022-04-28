import { StoreContext } from "flashcards/frontend/store";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useParams } from "react-router-dom";

export const FlashcardsEdit = observer(() => {
  let { deckId } = useParams<{ deckId: string }>();
  const store = useContext(StoreContext);
  const deck = store.flashcardStore.decks[deckId!]!;

  return (
    <div>
      Decks:
      <ul>
        {Object.entries(decks.decks).map(([deckId, deck]) => (
          <li key={deckId}>
            {deck!.title} ({Object.keys(deck!.cards).length} cards){" "}
            <button>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
});
