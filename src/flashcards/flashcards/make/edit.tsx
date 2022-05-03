import { StoreContext } from "flashcards/app/store";
import { DeckSettingsElement } from "flashcards/flashcards/make/deckSettings";
import { CardInputData } from "flashcards/flashcards/types/types";
import { observer } from "mobx-react-lite";
// import { InputWithL.abel } from "modules/form/index2";
import { entries } from "modules/typescript/objectEntries";
import React, { useContext } from "react";
import { useParams } from "react-router-dom";

export const addLine = () => {};

export const FlashcardsEdit = observer(() => {
  let { deckId } = useParams<{ deckId: string }>();
  if (!deckId) throw new Error();
  const store = useContext(StoreContext);
  const deck = store.flashcardStore.getDeck(deckId);

  return (
    <div>
      <h1>{deck.title}</h1>
      <button onClick={addLine}>Add</button>
      <DeckSettingsElement deckId={deckId} />

      <div>
        {entries(deck.cards).map(([cardId, card]) => (
          <Row key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
});

export const Row: React.FC<{ card: CardInputData }> = ({ card }) => {
  return (
    <div>
      <div>
        <input type="text" value={card.front} />
        <input type="text" value={card.back} />
      </div>
    </div>
  );
};
