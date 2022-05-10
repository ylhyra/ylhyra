import { Button } from "flashcards/app/elements/button";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { addRowsIfMissing } from "flashcards/flashcards/make/import/actions";
import { form } from "modules/form";
import React from "react";

export const ImportFlashcards = ({ deck }: { deck: Deck }) => {
  const _form = new form({
    fields: [
      {
        name: "input",
        type: "textarea",
        label: `Tab or " = " separated list`,
      },
    ],
  });
  const { Form, InputWithLabel, resetForm } = _form;

  return (
    <div>
      <Form>
        <InputWithLabel name="input" />
        <Button
          type="button"
          onClick={() => {
            addRowsIfMissing(deck, _form.getFormValues().input);
            _form.resetForm();
          }}
        >
          Add multiple
        </Button>
      </Form>
    </div>
  );
};
