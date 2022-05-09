import { Button } from "flashcards/app/elements/button";
import {
  getDeckById,
  saveFlashcardsStore,
} from "flashcards/flashcards/actions/baseFlashcardsStore/functions";
import { DeckSettings } from "flashcards/flashcards/types/deckSettings";
import { DeckId } from "flashcards/flashcards/types/types";
import { observer } from "mobx-react-lite";
import { FieldsSetup, form } from "modules/form";
import React from "react";

/** See type {@link DeckSettings} */
export const deckSettingsFields: FieldsSetup<DeckSettings> = [
  {
    name: "title",
  },
  {
    name: "frontSideLanguage",
    label: "Language of the front side (the side being studied)",
  },
  {
    name: "backSideLanguage",
    label: "Language of the back side (the side containing the explanations)",
  },
  {
    name: "direction",
    label: "Which side to show as prompt",
    type: "select",
    defaultValue: "BOTH",
    options: [
      {
        value: "BOTH",
        label: "Both sides can be shown as prompts",
      },
      {
        value: "ONLY_FRONT_TO_BACK",
        label: "Only use front side as a prompt",
      },
      {
        value: "ONLY_BACK_TO_FRONT",
        label: "Only use back side as a prompt",
      },
    ],
  },
  {
    name: "sideToShowFirst",
    label: "Side to show first",
    type: "select",
    options: [
      {
        value: "FRONT_SIDE",
        label: "Front side",
      },
      {
        value: "RANDOM",
        label: "Either side (random)",
      },
    ],
    onlyShowIf: {
      key: "preset",
      is: "FOREIGN_LANGUAGE_PERSONAL_USE",
    },
  },
  {
    name: "automaticDependencies",
    type: "checkbox",
    defaultValue: true,
    label: "Automatic dependencies",
    description: "Only recommended for languages",
  },
  {
    name: "automaticallyOccludeClashing",
    type: "checkbox",
    defaultValue: true,
    label: "Automatically give hints when two cards have the same prompt",
  },
  {
    name: "numberOfRatingButtons",
    label: "Number of rating buttons",
    type: "select",
    defaultValue: 3,
    options: [
      {
        value: 3,
        label: `Three buttons ("Bad", "Good", and "Easy")`,
      },
      {
        value: 2,
        label: `Two buttons ("Bad" and "Good")`,
      },
    ],
  },
];

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
