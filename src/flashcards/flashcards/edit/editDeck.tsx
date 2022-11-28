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
  value: string | undefined;
  name: string;
}

export const Rows = observer(({ deck }: { deck: Deck }) => {
  const grid: GridElement[][] = deck.rowsAsArray.map((row) => {
    return [
      { value: row.data.front, name: "front" },
      { value: row.data.back, name: "back" },
    ];
  });
  return (
    <ReactDataSheet
      data={grid}
      valueRenderer={(cell) => cell.value}
      // @ts-ignore
      sheetRenderer={(props) => (
        <table className="data-grid">
          <thead>
            <tr>
              {/*todo:*/}
              {grid[0].map((col) => (
                <th key={col.name}>{col.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>{props.children}</tbody>
        </table>
      )}
      onCellsChanged={(changes) => {
        // const grid = state.grid.map(row => [...row]);
        // changes.forEach(({ cell, row, col, value }) => {
        //   grid[row][col] = { ...grid[row][col], value };
        // });
        // this.setState({ grid });
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
