import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { observer } from "mobx-react";
import { FormHelper } from "modules/form";
import React from "react";
import { deckDataFields } from "flashcards/flashcards/actions/deck/deckData";

export const DeckSettingsElement = observer(({ deck }: { deck: Deck }) => {
  const { Form, AllFields } = new FormHelper({
    values: deck,
    fields: deckDataFields,
  });

  return (
    <div>
      <Form>
        <AllFields />
      </Form>
    </div>
  );
});
