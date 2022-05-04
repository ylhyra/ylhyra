import { CardInputData } from "flashcards/flashcards/types/types";
import { FieldsSetup, form } from "modules/form";
import React from "react";

const rowFields: FieldsSetup<CardInputData> = [
  {
    name: "front",
    label: "Front side",
  },
  {
    name: "back",
    label: "Back side",
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
        value: "FRONT_TO_BACK",
        label: "Only use front side as a prompt",
      },
      {
        value: "BACK_TO_FRONT",
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
    // onlyShowIf: {
    //   key: "preset",
    //   is: "FOREIGN_LANGUAGE_PERSONAL_USE",
    // },
  },
  {
    name: "automaticDependencies",
    label: "Automatic find which cards this card depends on",
    defaultValue: true,
    type: "checkbox",
  },
  {
    name: "automaticallyDependOnThis",
    label: "Allow cards to automatically depend on this",
    defaultValue: true,
    type: "checkbox",
  },
  { name: "lemmas", label: "Lemmas" },
];

export const Row = ({ card }: { card: CardInputData }) => {
  const { Form, AllFields, Input } = new form<CardInputData>({
    values: card,
    fields: rowFields,
  });

  return (
    <div>
      <Form>
        {/*<Fields />*/}
        <Input name="front" />
        <Input name="back" />
      </Form>
    </div>
  );

  // return (
  //   <div>
  //     <div>
  //       {/*<input type="text" value={card.front} />*/}
  //       {/*<input type="text" value={card.back} />*/}
  //     </div>
  //   </div>
  // );
};
