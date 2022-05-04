import { Button } from "flashcards/app/elements/button";
import { StoreContext } from "flashcards/app/store";
import { getDeckTitle } from "flashcards/flashcards/flashcardsStore";
import { newDeck } from "flashcards/flashcards/make/actions";
import { observer } from "mobx-react-lite";
import { entries } from "modules/typescript/objectEntries";
import React, { useContext } from "react";
import { Link } from "react-router-dom";

export const FlashcardsMake = observer(function () {
  const store = useContext(StoreContext);
  const { decks } = store.flashcardStore;

  return (
    <div>
      Decks:
      <Button onClick={newDeck}>New deck</Button>
      <ul>
        {entries(decks).map(([deckId, deck]) => (
          <li key={deckId}>
            {getDeckTitle(deck)} ({Object.keys(deck.cards).length} cards){" "}
            <Link to={`/flashcards/deck/${deckId}`}>Edit</Link>
          </li>
        ))}
      </ul>
      {Object.keys(decks).length === 0 && <div>No decks.</div>}
    </div>
  );
});
