import { StoreContext } from "flashcards/app/store";
import { getDeckTitle } from "flashcards/flashcards/store";
import { observer } from "mobx-react-lite";
import { entries } from "modules/typescript/objectEntries";
import { useContext } from "react";
import { Link } from "react-router-dom";

export const FlashcardsMake = observer(function () {
  const store = useContext(StoreContext);
  const { decks } = store.flashcardStore;

  return (
    <div>
      Decks:
      <ul>
        {entries(decks).map(([deckId, deck]) => (
          <li key={deckId}>
            {getDeckTitle(deck)} ({Object.keys(deck.cards).length} cards){" "}
            <Link to={`/flashcards/deck/${deckId}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
});
