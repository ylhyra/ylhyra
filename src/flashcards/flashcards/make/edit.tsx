import { Button } from "flashcards/app/elements/button";
import { StoreContext } from "flashcards/app/store";
import { getDeckTitle } from "flashcards/flashcards/flashcardsStore";
import { addLine } from "flashcards/flashcards/make/actions";
import { DeckSettingsElement } from "flashcards/flashcards/make/deckSettings";
import { Row } from "flashcards/flashcards/make/row";
import { observer } from "mobx-react-lite";
import { entries } from "modules/typescript/objectEntries";
import React, { useContext } from "react";
import { useParams } from "react-router-dom";

export const FlashcardsEdit = observer(() => {
  let { deckId } = useParams<{ deckId: string }>();
  const store = useContext(StoreContext);
  const deck = store.flashcardStore.getDeckById(deckId!);
  if (!deck) return <div>No deck with that id.</div>;

  return (
    <div>
      <h1>{getDeckTitle(deck)}</h1>
      <DeckSettingsElement deckId={deckId!} />
      <hr />
      <Button type="button" onClick={() => addLine(deckId!)}>
        Add row
      </Button>
      <div>
        {entries(deck.cards).map(([cardId, card]) => (
          <Row key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
});
