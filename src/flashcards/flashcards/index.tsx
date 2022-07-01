import { Button } from "flashcards/app/elements/button";
import { getTitle } from "flashcards/app/functions";
import { getFlashcardsStore } from "flashcards/flashcards/actions/baseFlashcardsStore/flashcardsStore";
import { newDeck } from "flashcards/flashcards/actions/deck/functions";
import { observer } from "mobx-react";
import { Link } from "modules/router";
import { entries } from "modules/typescript/objectEntries";
import React from "react";
import { Helmet } from "react-helmet";

export const FlashcardsMake = observer(function () {
  const { decks } = getFlashcardsStore();

  return (
    <>
      <Helmet>
        <title>{getTitle("Decks")}</title>
      </Helmet>
      <div>
        <Link to={`/flashcards/play/all`}>Play all decks</Link>
        <hr />
        Decks:
        <Button onClick={newDeck}>New deck</Button>
        <ul>
          {entries(decks).map(([deckId, deck]) => (
            <li key={deckId}>
              {deck.title} ({deck.rows.length} cards){" "}
              <Link to={`/flashcards/deck/${deckId}`}>Edit</Link>{" "}
              <Link to={`/flashcards/play/${deckId}`}>Play</Link>
            </li>
          ))}
        </ul>
        {Object.keys(decks).length === 0 && <div>No decks.</div>}
      </div>{" "}
    </>
  );
});
