import get_by_id from "inflection/getViaApi/getById";
import { BIN_id } from "inflection/server/types";
import { Rows } from "inflection/tables/types";
import Word from "inflection/tables/word";

/*
  Testing helper function
  Callback is a Word
*/
let cache: Record<string, Rows> = {};
export const getWordFromServer = (
  id: BIN_id,
  mocha_done_SHOULD_REMOVE: Function,
  input_function: Function,
  dont_keep_in_cache?: Boolean
) => {
  if (cache[id]) {
    try {
      input_function(new Word(cache[id]));
    } catch (error) {
      mocha_done_SHOULD_REMOVE(error);
    }
  } else {
    get_by_id(id, (server_results) => {
      if (server_results === null) {
        throw new Error("Server request failed");
      }
      if (!dont_keep_in_cache) {
        cache[id] = server_results;
      }
      try {
        input_function(new Word(server_results));
      } catch (error) {
        console.log(error);
        mocha_done_SHOULD_REMOVE(error);
      }
    });
  }
};
