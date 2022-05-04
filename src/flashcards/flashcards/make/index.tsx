import { Button } from "flashcards/app/elements/button";
import { getFlashcardsStore } from "flashcards/flashcards/flashcardsStore";
import { newDeck } from "flashcards/flashcards/make/actions";
import { observer } from "mobx-react-lite";
import { entries } from "modules/typescript/objectEntries";
import React from "react";
import { Link } from "react-router-dom";
import { printDeckTitle } from "flashcards/flashcards/functions";

export const FlashcardsMake = observer(function () {
  const { decks } = getFlashcardsStore();

  return (
    <div>
      Decks:
      <Button onClick={newDeck}>New deck</Button>
      <ul>
        {entries(decks).map(([deckId, deck]) => (
          <li key={deckId}>
            {printDeckTitle(deck)} ({Object.keys(deck.rows).length} cards){" "}
            <Link to={`/flashcards/deck/${deckId}`}>Edit</Link>{" "}
            <Link to={`/flashcards/play/${deckId}`}>Play</Link>
          </li>
        ))}
      </ul>
      {Object.keys(decks).length === 0 && <div>No decks.</div>}
    </div>
  );
});
