import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { deckSettingsFields } from "flashcards/flashcards/actions/deck/deckSettings.fields";
import { observer } from "mobx-react-lite";
import { form } from "modules/form";
import React from "react";

export const DeckSettingsElement = observer(({ deck }: { deck: Deck }) => {
  const { Form, AllFields } = new form({
    values: deck.settings,
    fields: deckSettingsFields,
  });

  return (
    <div>
      <Form>
        <AllFields />
      </Form>
    </div>
  );
});
