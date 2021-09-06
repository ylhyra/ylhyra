import store from "app/app/store";
import { send } from "Editor/web-socket";
import error from "app/app/error";
import axios from "app/app/axios";

/*

  TODO Check if suggestions are needed before sending

*/
export const MakeSuggestions = () => {
  const { list, tokenized, suggestions, translation } = store.getState().editor;
  // Information is sent through a WebSocket
  console.log("%c [Requesting suggestions...]", "color: RoyalBlue");
  var api = new mw.Api();
  api
    .get({
      action: "session_verification",
      format: "json",
    })
    .done(function (data) {
      const session_verification_token = data.session_verification.token;
      if (!session_verification_token) {
        error("Server could not verify that you are logged in");
        return console.log(data);
      }
      send({
        type: "REQUEST_SUGGESTIONS",
        list: list,
        tokenized,
        suggestions,
        translation,
        session_verification_token,
        // from: metadata.from,
        // to: metadata.to,
      });
    });
};

export const receiveSuggestions = async (action) => {
  /* Suggest analysis */
  let grammatical_analysis = {};
  store.getState().list.arrayOfAllWordIDs.forEachAsync(() => {
    return new Promise(async () => {});
  });

  await action.analysis.forEachAsync((item) => {
    return new Promise(async (resolve) => {
      /* Temporary, only allow one word at a time */
      if (!item.ids || item.ids.length > 1) return resolve();
      const id = item.ids[0];
      if (!id) return resolve();
      const analysis = item.analysis[0].analysis;

      const data = (
        await axios.post(`/api/inflection/find_inflection_id`, {
          analysis: item.analysis[0],
        })
      ).data;

      /*
        TODO: Currently only fetches one match.
        Should show more bin leaf matches and ALSO more options inside each word
      */

      const BIN_id = data.length > 0 && data[0].BIN_id;
      grammatical_analysis[id] = {
        // ...(state[id] || {}),
        ...analysis,
        BIN_id,
      };
      resolve();
    });
  });

  store.dispatch({
    type: "GRAMMATICAL_ANALYSIS",
    grammatical_analysis,
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
