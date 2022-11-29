import { Row } from "flashcards/flashcards/actions/row/row";
import { ImportFlashcards } from "flashcards/flashcards/edit/import/import";
import { Button } from "flashcards/app/elements/button";
import { getTitle } from "flashcards/app/functions";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import {
  addRow,
  deleteDeck,
  getDeckById,
} from "flashcards/flashcards/actions/deck/functions";
import { DeckSettingsElement } from "flashcards/flashcards/edit/deckSettings";
import { EditRow } from "flashcards/flashcards/edit/row";
import { DeckId } from "flashcards/flashcards/types";
import { observer } from "mobx-react";
import { Link } from "modules/router";
import React from "react";
import { Helmet } from "react-helmet-async";
import ReactDataSheet from "react-datasheet";
import { deckDataFields } from "flashcards/flashcards/actions/deck/deckData";
import { rowFields } from "flashcards/flashcards/actions/row/rowData";

export const FlashcardsEdit = observer(({ deckId }: { deckId: DeckId }) => {
  const deck = getDeckById(deckId! as DeckId);
  if (!deck) return <div>No deck with that id.</div>;

  return (
    <>
      <Helmet>
        <title>{getTitle(deck.title)}</title>
      </Helmet>
      <div>
        <h1>{deck.title}</h1>
        <div className="flex justify-center">
          <Link to={`/flashcards/${deckId}/play`} className="btn px-4 py-2">
            Play
          </Link>
        </div>

        <DeckSettingsElement deck={deck} />
        <hr />
        <ImportFlashcards deck={deck} />
        <hr />
        <h3>Rows</h3>
        <Button type="button" onClick={() => addRow(deck)}>
          Add row
        </Button>
        <div className="editor-rows">
          <Rows deck={deck} />
        </div>
        <button className="btn btn-gray" onClick={() => deleteDeck(deck)}>
          Delete deck
        </button>
      </div>
    </>
  );
});

export interface GridElement extends ReactDataSheet.Cell<GridElement, number> {
  name: string;
  row: Row;
}

export const Rows = observer(({ deck }: { deck: Deck }) => {
  // @ts-ignore
  const grid: GridElement[][] = deck.rowsAsArray.map((row) => {
    console.log(row);
    return rowFields.map((field) => {
      return {
        name: field.name,
        row,
        // todo
        // @ts-ignore
        value: row[field.name],
      };
    });
  });
  return (
    <ReactDataSheet
      data={grid}
      // @ts-ignore
      valueRenderer={(cell) => cell.row.data[cell.name]}
      // @ts-ignore
      sheetRenderer={(props) => (
        <table className="data-grid">
          <thead>
            <tr>
              {/*todo:*/}
              {deckDataFields.map((col) => (
                <th key={col.name}>{col.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>{props.children}</tbody>
        </table>
      )}
      onCellsChanged={(changes) => {
        changes.forEach(({ cell, row, col, value }) => {
          // @ts-ignore
          cell!.row.data[cell!.name] = value;
        });
      }}
      overflow="wrap"
    />
  );

  return (
    <>
      {deck.rowsAsArray.map((row) => (
        <EditRow key={row.rowId} row={row} />
      ))}
    </>
  );
});
