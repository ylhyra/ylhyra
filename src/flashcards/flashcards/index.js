"use strict";
exports.__esModule = true;
exports.FlashcardsMake = void 0;
var button_1 = require("flashcards/app/elements/button");
var flashcardsStore_1 = require("flashcards/flashcards/actions/baseFlashcardsStore/flashcardsStore");
var _functions_1 = require("flashcards/flashcards/actions/deck/_functions");
var mobx_react_lite_1 = require("mobx-react-lite");
var objectEntries_1 = require("modules/typescript/objectEntries");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
exports.FlashcardsMake = (0, mobx_react_lite_1.observer)(function () {
    var decks = (0, flashcardsStore_1.getFlashcardsStore)().decks;
    return (<div>
      <react_router_dom_1.Link to={"/flashcards/play/all"}>Play all decks</react_router_dom_1.Link>
      <hr />
      Decks:
      <button_1.Button onClick={_functions_1.newDeck}>New deck</button_1.Button>
      <ul>
        {(0, objectEntries_1.entries)(decks).map(function (_a) {
            var deckId = _a[0], deck = _a[1];
            return (<li key={deckId}>
            {deck.title} ({deck.rows.length} cards){" "}
            <react_router_dom_1.Link to={"/flashcards/deck/".concat(deckId)}>Edit</react_router_dom_1.Link>{" "}
            <react_router_dom_1.Link to={"/flashcards/play/".concat(deckId)}>Play</react_router_dom_1.Link>
          </li>);
        })}
      </ul>
      {Object.keys(decks).length === 0 && <div>No decks.</div>}
    </div>);
});
