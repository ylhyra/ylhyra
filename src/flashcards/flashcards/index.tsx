import { Button } from "flashcards/app/elements/button";
import { getTitle } from "flashcards/app/functions";
import { newDeck } from "flashcards/flashcards/actions/deck/functions";
import { getFlashcardsStore } from "flashcards/flashcards/flashcardsStore";
import { observer } from "mobx-react";
import { Link } from "modules/router";
import { entries } from "modules/typescript/objectEntries";
import React from "react";
import { Helmet } from "react-helmet-async";

export const FlashcardsMake = observer(function () {
  const { decks } = getFlashcardsStore();

  return (
    <>
      <Helmet>
        <title>{getTitle("Decks")}</title>
      </Helmet>
      <div>
        <div className="flex justify-center">
          <Link to={`/flashcards/play/all`} className="btn p-4 ">
            Play all decks
          </Link>
        </div>
        <hr />
        <ul>
          {entries(decks).map(([deckId, deck]) => (
            <li key={deckId} className="flex hover:bg-gray-200">
              <Link to={`/flashcards/deck/${deckId}`} className="flex-1 p-1">
                <b>{deck.title}</b>{" "}
                <span className="text-sm text-gray-600">
                  ({deck.rows.length} cards)
                </span>{" "}
              </Link>
              <div className="p-1">
                <Link
                  to={`/flashcards/deck/${deckId}`}
                  className="btn btn-gray"
                >
                  Add
                </Link>{" "}
                <Link to={`/flashcards/play/${deckId}`} className="btn">
                  Play
                </Link>
              </div>
            </li>
          ))}
        </ul>
        {Object.keys(decks).length === 0 && <div>No decks.</div>}
      </div>
      <Button onClick={newDeck}>New deck</Button>
    </>
  );
});
