import { RowData } from "flashcards/flashcards/types/rowData";
import { form } from "modules/form";
import { rowFields } from "flashcards/flashcards/make/rowFields";
import { rowStore } from "flashcards/flashcards/stores/deck/rowStore";
import React from "react";

export const EditRow = ({ row }: { row: rowStore }) => {
  const { Form, AllFields, Input } = new form<RowData>({
    values: row.data,
    fields: rowFields,
  });

  return (
    <div key={row.data.rowId}>
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
