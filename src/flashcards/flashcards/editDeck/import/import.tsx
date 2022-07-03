import { Button } from "flashcards/app/elements/button";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { addRowsIfMissing } from "flashcards/flashcards/editDeck/import/actions";
import { FormHelper } from "modules/form";
import React from "react";

export function ImportFlashcards({ deck }: { deck: Deck }) {
  const _form = new FormHelper({
    fields: [
      {
        name: "input",
        type: "textarea",
        label: `Tab or "=" separated list`,
      },
    ],
  });
  const { Form, InputWithLabel } = _form;

  return (
    <div>
      <Form>
        <h3>Import multiple</h3>
        <InputWithLabel name="input" />
        <Button
          type="button"
          onClick={async () => {
            await addRowsIfMissing(
              deck,
              _form.getFormValuesIgnoringDefaults().input
            );
            _form.resetForm();
          }}
        >
          Add multiple
        </Button>
      </Form>
    </div>
  );
}
