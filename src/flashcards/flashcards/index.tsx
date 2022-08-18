import { Button } from "flashcards/app/elements/button";
import { getTitle } from "flashcards/app/functions";
import { newDeck } from "flashcards/flashcards/actions/deck/functions";
import { store } from "flashcards/store";
import { observer } from "mobx-react";
import { Link } from "modules/router";
import React from "react";
import { Helmet } from "react-helmet-async";
import {
  percentageKnown,
  percentageSeen,
} from "./actions/functions/percentageKnown";

export const FlashcardsMake = observer(function () {
  const { decks } = store;

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
          {[...decks.values()].map((deck) => (
            <li key={deck.deckId} className="flex hover:bg-gray-200">
              <Link
                to={`/flashcards/deck/${deck.deckId}`}
                className="flex-1 p-1"
              >
                <b>{deck.title}</b>{" "}
                <span className="text-sm text-gray-600">
                  {/*TODO: Ignore deleted cards*/}({deck.rows.size} cards){" "}
                  {percentageKnown(deck.cards)}% known{" "}
                  {percentageSeen(deck.cards)}% seen
                </span>{" "}
              </Link>
              <div className="p-1">
                <Link
                  to={`/flashcards/deck/${deck.deckId}`}
                  className="btn btn-gray"
                >
                  Add
                </Link>{" "}
                <Link to={`/flashcards/play/${deck.deckId}`} className="btn">
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
