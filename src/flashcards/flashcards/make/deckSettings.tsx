import { store } from "flashcards/app/store";
import { DeckSettings } from "flashcards/flashcards/types/types";
import { login } from "flashcards/user/actions";
import { observer } from "mobx-react-lite";
import { FieldsSetup, form } from "modules/form";
import React from "react";

/** @see DeckSettings */
const deckSettingsFields: FieldsSetup<DeckSettings> = [
  {
    name: "title",
    type: "text",
  },
  {
    name: "numberOfRatingButtons",
    label: "Number of rating buttons",
    type: "select",
    defaultValue: 3,
    options: [
      {
        value: 3,
        label: "Three buttons (Bad - Good - Easy)",
      },
      {
        value: 4,
        label: "Two buttons (Bad - Good)",
      },
    ],
  },
];

export const DeckSettingsElement = observer(
  ({ deckId }: { deckId: string }) => {
    const deck = store.flashcardStore.getDeck(deckId);

    const { Form, Fields } = new form({
      onSubmit: login,
      initialValues: {},
      fields: deckSettingsFields,
    });

    return (
      <div>
        <Form>
          <Fields />
        </Form>
      </div>
    );
  }
);
