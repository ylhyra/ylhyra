import get_by_id_api from "inflection/getViaApi/getById";
import get_by_id_server from "inflection/server/search/getById";
import { BIN_id } from "inflection/server/types";
import { Rows } from "inflection/tables/types";
import Word from "inflection/tables/word";
import DoneCallback = jest.DoneCallback;

let get_by_id = get_by_id_server;
if (
  process.env.USE_API_FOR_INFLECTION_SINCE_I_DONT_HAVE_THE_INFLECTION_DATABASE
) {
  get_by_id = get_by_id_api;
}

/*
  Testing helper function
  Callback is a Word
*/
let cache: Record<string, Rows> = {};
export const getWordFromServer = (
  id: BIN_id,
  jestDoneCallback: DoneCallback,
  callback: (arg0: Word) => any,
  dont_keep_in_cache?: Boolean
) => {
  // if (cache[id]) {
  //   try {
  //     callback(new Word(cache[id]));
  //   } catch (error) {
  //     jestDoneCallback(error);
  //   }
  // } else {
  get_by_id(id, (server_results) => {
    if (server_results === null) {
      throw new Error("Server request failed");
    }
    if (!dont_keep_in_cache) {
      cache[id] = server_results;
    }
    try {
      callback(new Word(server_results));
    } catch (error) {
      console.log(error);
      jestDoneCallback(error);
    }
  });
  // }
};
