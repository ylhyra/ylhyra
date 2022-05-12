import { Button } from "flashcards/app/elements/button";
import {
  getDeckById,
  saveFlashcardsStore,
} from "flashcards/flashcards/actions/baseFlashcardsStore/_functions";
import { DeckSettingsElement } from "flashcards/flashcards/editor/deckSettings";
import { addRowsIfMissing } from "flashcards/flashcards/editor/import/actions";
import { ImportFlashcards } from "flashcards/flashcards/editor/import/import";
import { EditRow } from "flashcards/flashcards/editor/row";
import { DeckId } from "flashcards/flashcards/types";
import { observer } from "mobx-react-lite";
import { values } from "modules/typescript/objectEntries";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export const FlashcardsEdit = observer(() => {
  let { deckId } = useParams<{ deckId: DeckId }>();
  const deck = getDeckById(deckId! as DeckId);
  if (!deck) return <div>No deck with that id.</div>;

  /** Tmp test */
  useEffect(() => {
    setTimeout(() => {
      let data = "";
      for (let i = 0; i < 50; i++) {
        data += `test${i} = test${i}\n`;
      }
      const start = performance.now();
      addRowsIfMissing(deck, data);
      const time = performance.now() - start;
      console.log(`Test took ${Math.round(time)} milliseconds`);
    }, 30);
  }, [deckId]);

  console.log("Interface rendered!");
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
        {values(deck.rows).map((row) => (
          <EditRow key={row.rowId} row={row} />
        ))}
      </div>
    </div>
  );
});

// @ts-ignore
window["addRowsIfMissing"] = addRowsIfMissing;
