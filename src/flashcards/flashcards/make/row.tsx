import { Row } from "flashcards/flashcards/types/row";
import { form } from "modules/form";
import React from "react";
import { rowFields } from "flashcards/flashcards/make/rowFields";

export const EditRow = ({ card }: { card: Row }) => {
  const { Form, AllFields, Input } = new form<Row>({
    values: card,
    fields: rowFields,
  });

  return (
    <div key={card.rowId}>
      <Form>
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
