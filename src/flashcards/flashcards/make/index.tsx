import { StoreContext } from "flashcards/frontend/store";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { entries } from "modules/typescript/objectEntries";

export const FlashcardsMake = observer(function () {
  const store = useContext(StoreContext);
  const { decks } = store.flashcardStore;

  return (
    <div>
      Decks:
      <ul>
        {entries(decks).map(([deckId, deck]) => (
          <li key={deckId}>
            {deck.title} ({Object.keys(deck.cards).length} cards){" "}
            <Link to={`/flashcards/deck/${deckId}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
});
