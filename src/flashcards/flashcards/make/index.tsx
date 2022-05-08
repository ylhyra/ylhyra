import { Button } from "flashcards/app/elements/button";
import { getFlashcardsStore } from "flashcards/flashcards/stores/base/flashcardsStore";
import { printDeckTitle } from "flashcards/flashcards/make/functions";
import { newDeck } from "flashcards/flashcards/make/actions";
import { observer } from "mobx-react-lite";
import { entries } from "modules/typescript/objectEntries";
import React from "react";
import { Link } from "react-router-dom";

export const FlashcardsMake = observer(function () {
  const { OLDdecks } = getFlashcardsStore();

  return (
    <div>
      Decks:
      <Button onClick={newDeck}>New deck</Button>
      <ul>
        {entries(OLDdecks).map(([deckId, deck]) => (
          <li key={deckId}>
            {printDeckTitle(deck)} ({Object.keys(deck.rows).length} cards){" "}
            <Link to={`/flashcards/deck/${deckId}`}>Edit</Link>{" "}
            <Link to={`/flashcards/play/${deckId}`}>Play</Link>
          </li>
        ))}
      </ul>
      {Object.keys(OLDdecks).length === 0 && <div>No decks.</div>}
    </div>
  );
});
