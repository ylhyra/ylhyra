import { Button } from "flashcards/app/elements/button";
import {
  getDeckById,
  saveFlashcardsStore,
} from "flashcards/flashcards/actions/baseFlashcardsStore/functions";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { DeckSettingsElement } from "flashcards/flashcards/editor/deckSettings";
import { ImportFlashcards } from "flashcards/flashcards/editor/import/import";
import { EditRow } from "flashcards/flashcards/editor/row";
import { DeckId } from "flashcards/flashcards/types";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link, useParams } from "react-router-dom";

export const FlashcardsEdit = observer(() => {
  let { deckId } = useParams<{ deckId: DeckId }>();
  const deck = getDeckById(deckId! as DeckId);
  if (!deck) return <div>No deck with that id.</div>;

  return (
    <div>
      <h1>{deck.title}</h1>
      <Button type="button" onClick={() => saveFlashcardsStore()}>
        Save
      </Button>
      <Link to={`/flashcards/play/${deckId}`}>Play</Link>
      <DeckSettingsElement deck={deck} />
      <hr />
      <ImportFlashcards deck={deck} />
      <hr />
      <h3>Rows</h3>
      <Button type="button" onClick={() => deck.addRow()}>
        Add row
      </Button>
      <div>
        <Rows deck={deck} />
      </div>
    </div>
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
