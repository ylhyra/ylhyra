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
import { newChapter } from "flashcards/flashcards/actions/chapter/chapter";

export const FlashcardsMake = observer(function () {
  const { decks } = store;

  return (
    <>
      <Helmet>
        <title>{getTitle("Decks")}</title>
      </Helmet>
      <div>
        {/*<div className="flex justify-center">*/}
        {/*  <Link to={`/flashcards/play/all`} className="btn p-4 ">*/}
        {/*    Play all decks*/}
        {/*  </Link>*/}
        {/*</div>*/}
        <hr />
        <ul>
          {[...decks.values()]
            .filter((deck) => !deck.settings.deleted)
            .map((deck) => (
              <li key={deck.deckId}>
                <div className="flex hover:bg-gray-200">
                  <Link
                    to={`/flashcards/${deck.deckId}/play`}
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
                      to={`/flashcards/${deck.deckId}`}
                      className="btn btn-gray"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
                <div>
                  <ul>
                    {deck.chapters.map((chapter) => (
                      <li key={1}>CHAPTER</li>
                    ))}
                  </ul>
                  <button onClick={() => newChapter(deck)}>New chapter</button>
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
