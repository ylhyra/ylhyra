import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { StoreContext } from "flashcards/frontend/store";
import { flashcardStore } from "flashcards/frontend/flashcards/store";

export default observer(function () {
  const store = useContext(StoreContext);
  const { decks } = store.flashcardStore;

  return (
    <div>
      Decks:
      <ul>
        {Object.entries(decks.decks).map(([deckId, deck]) => (
          <li key={deckId}>
            {deck!.title} ({Object.keys(deck!.cards).length} cards)
          </li>
        ))}
      </ul>
    </div>
  );
});
