import { Button } from "flashcards/app/elements/button";
import { getDeckById } from "flashcards/flashcards/stores/base/functions";
import { addRow } from "flashcards/flashcards/make/actions";
import { DeckSettingsElement } from "flashcards/flashcards/make/deckSettings";
import { printDeckTitle } from "flashcards/flashcards/make/functions";
import { addRowsIfMissing } from "flashcards/flashcards/make/import/actions";
import { ImportFlashcards } from "flashcards/flashcards/make/import/import";
import { EditRow } from "flashcards/flashcards/make/row";
import { observer } from "mobx-react-lite";
import { values } from "modules/typescript/objectEntries";
import React from "react";
import { useParams } from "react-router-dom";

export const FlashcardsEdit = observer(() => {
  let { deckId } = useParams<{ deckId: string }>();
  const deck = getDeckById(deckId!);
  if (!deck) return <div>No deck with that id.</div>;

  return (
    <div>
      <h1>{printDeckTitle(deck)}</h1>
      <DeckSettingsElement deckId={deckId!} />
      <ImportFlashcards />
      <hr />
      <Button type="button" onClick={() => addRow(deckId!)}>
        Add row
      </Button>
      <div>
        {values(deck.rows).map((card) => (
          <EditRow key={card.rowId} card={card} />
        ))}
      </div>
    </div>
  );
});

// @ts-ignore
window["addRowsIfMissing"] = addRowsIfMissing;
