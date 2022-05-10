import { Button } from "flashcards/app/elements/button";
import {
  getDeckById,
  saveFlashcardsStore,
} from "flashcards/flashcards/actions/baseFlashcardsStore/functions";
import { deckSettingsFields } from "flashcards/flashcards/actions/deck/deckSettings.fields";
import { DeckId } from "flashcards/flashcards/types";
import { observer } from "mobx-react-lite";
import { form } from "modules/form";
import React from "react";

export const DeckSettingsElement = observer(
  ({ deckId }: { deckId: DeckId }) => {
    const deck = getDeckById(deckId as DeckId);
    if (!deck) return null;

    const { Form, AllFields } = new form({
      values: deck.settings,
      fields: deckSettingsFields,
    });

    return (
      <div>
        <Form>
          <AllFields />
          <Button type="button" onClick={() => saveFlashcardsStore()}>
            Save
          </Button>
        </Form>
      </div>
    );
  }
);
