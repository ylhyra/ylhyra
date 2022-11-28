import { Row } from "flashcards/flashcards/actions/row/row";
import { EditRow } from "flashcards/flashcards/edit/row";
import React from "react";

export function EditCard({ row, done }: { row: Row; done: () => void }) {
  return (
    <div>
      <EditRow row={row} />
      <button className="btn" onClick={done}>
        Done
      </button>
    </div>
  );
}
