import { Button } from "flashcards/app/elements/button";
import { getTitle } from "flashcards/app/functions";
import { getDeckById } from "flashcards/flashcards/actions/baseFlashcardsStore/functions";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { addRow } from "flashcards/flashcards/actions/deck/functions";
import { DeckSettingsElement } from "flashcards/flashcards/editor/deckSettings";
import { ImportFlashcards } from "flashcards/flashcards/editor/import/import";
import { EditRow } from "flashcards/flashcards/editor/row";
import { DeckId } from "flashcards/flashcards/types";
import { observer } from "mobx-react-lite";
import { Link } from "modules/router";
import React from "react";
import { Helmet } from "react-helmet";

export const FlashcardsEdit = observer(({ deckId }: { deckId: DeckId }) => {
  const deck = getDeckById(deckId! as DeckId);
  if (!deck) return <div>No deck with that id.</div>;

  return (
    <>
      <Helmet>
        <title>{getTitle(deck.title)}</title>
      </Helmet>
      <div>
        <h1>{deck.title}</h1>
        <Link to={`/flashcards/play/${deckId}`}>Play</Link>
        <DeckSettingsElement deck={deck} />
        <hr />
        <ImportFlashcards deck={deck} />
        <hr />
        <h3>Rows</h3>
        <Button type="button" onClick={() => addRow(deck)}>
          Add row
        </Button>
        <div className="editor-rows">
          <Rows deck={deck} />
        </div>
      </div>
    </>
  );
});

export const Rows = observer(({ deck }: { deck: Deck }) => {
  return (
    <>
      {deck.rows.slice(0, 20).map((row) => (
        <EditRow key={row.rowId} row={row} />
      ))}
    </>
  );
});
