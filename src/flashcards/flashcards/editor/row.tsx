import { Row } from "flashcards/flashcards/actions/row/row";
import { rowFields } from "flashcards/flashcards/actions/row/rowData.fields";
import { RowData } from "flashcards/flashcards/actions/row/rowData.types";
import { form } from "modules/form";
import React from "react";

export function EditRow({ row }: { row: Row }) {
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
}
