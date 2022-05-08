import { RowData } from "flashcards/flashcards/types/rowData";
import { form } from "modules/form";
import React from "react";
import { rowFields } from "flashcards/flashcards/make/rowFields";

export const EditRow = ({ card }: { card: RowData }) => {
  const { Form, AllFields, Input } = new form<RowData>({
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
