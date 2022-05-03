import { StoreContext } from "flashcards/app/store";
import { getDeckTitle } from "flashcards/flashcards/flashcardsStore";
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
  const store = useContext(StoreContext);
  const deck = store.flashcardStore.getDeckById(deckId!);
  if (!deck) return <div>No deck with that id.</div>;

  return (
    <div>
      <h1>{getDeckTitle(deck)}</h1>
      <button onClick={addLine}>Add</button>
      <DeckSettingsElement deckId={deckId!} />

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
        {/*<input type="text" value={card.front} />*/}
        {/*<input type="text" value={card.back} />*/}
      </div>
    </div>
  );
};
