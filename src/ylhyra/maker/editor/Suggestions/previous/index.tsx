import store from "ylhyra/app/app/store";
import { send } from "ylhyra/maker/editor/web-socket";
import React from "react";
// import GoogleTranslate from './GoogleTranslate'

/*

  - Checks which words/sentences are missing:
      1. Our suggestions
      2. GoogleTranslate
  - Then requests those things in batches.

*/
let started = false; // TEMPORARY!!! NEEDS TO BE REWORKED
export const request = () => {
  if (started) return; // TEMP!
  started = true; // TEMP!

  const { list, tokenized } = store.getState().editor;
  // Information is sent through a WebSocket
  console.log("%c [Requesting suggestions...]", "color: RoyalBlue");
  send({
    type: "REQUEST_SUGGESTIONS",
    list: list,
    tokenized: tokenized,
    // from: metadata.from,
    // to: metadata.to,
  });

  // GoogleTranslate()
};

/*
  Receives response from server.
  Dispatches suggestions.
*/
export const receiveSuggestions = (action) => {
  let items = {};
  action.content.forEach((suggestion) => {
    if (!items[suggestion.item_id]) {
      items[suggestion.item_id] = [];
    }
    items[suggestion.item_id].push({
      ...suggestion,
      also_part_of_definition:
        suggestion.also_part_of_definition &&
        suggestion.also_part_of_definition
          .split(",")
          .map((a) => parseInt(a))
          .concat([0])
          .sort((a, b) => a - b),
      definition: JSON.parse(suggestion.definition),
    });
  });
  store.dispatch({
    type: "SUGGEST",
    content: items,
  });
};

export const applySuggestions = () => {
  const { list, translation, suggestions } = store.getState().editor;
  for (let id of Object.keys(suggestions)) {
    if (!(id in translation.words) && !(id in translation.sentences)) {
      if (id in list.words) {
        store.dispatch({
          type: "UPDATE_DEFINITION",
          definition: suggestions[id][0].definition, // TODO! Other values like difficulty?
          selected: [id], // TODO!! "INCLUDES OTHER WORDS"
        });
      } else {
        store.dispatch({
          type: "UPDATE_SENTENCE",
          content: suggestions[id][0].definition,
          sentence_id: id,
        });
      }
    }
  }
};

class SuggestionsStatus extends React.PureComponent {
  render() {
    return null;
  }
}
export { SuggestionsStatus };
