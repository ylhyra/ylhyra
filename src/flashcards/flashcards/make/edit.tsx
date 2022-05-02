import { StoreContext } from "flashcards/app/store";
import { observer } from "mobx-react-lite";
import { InputWithLabel } from "modules/form/index2";
import { entries } from "modules/typescript/objectEntries";
import { useContext } from "react";
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
      <div>
        <b>Deck settings</b>
        <InputWithLabel name="title" title="Title" />

        <label>
          Direction:{" "}
          <select>
            <option>Both directions</option>
            <option>Front to back</option>
            <option>Back to front</option>
          </select>
        </label>
        <label>
          Which side should be shown first:{" "}
          <select>
            <option>Show front side first</option>
            <option>Either side can be shown first</option>
          </select>
        </label>
      </div>
      <div>
        {entries(deck.cards).map(([cardId, card]) => (
          <div key={card.id}>
            <b>{card.front}</b> – <span>{card.back}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
