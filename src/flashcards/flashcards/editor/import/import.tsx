import { Button } from "flashcards/app/elements/button";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { addRowsIfMissing } from "flashcards/flashcards/editor/import/actions";
import { form } from "modules/form";
import React from "react";

export const ImportFlashcards = ({ deck }: { deck: Deck }) => {
  const _form = new form({
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
          onClick={() => {
            addRowsIfMissing(deck, _form.getFormValuesIgnoringDefaults().input);
            _form.resetForm();
          }}
        >
          Add multiple
        </Button>
      </Form>
    </div>
  );
};
