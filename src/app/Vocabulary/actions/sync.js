import store from "app/App/store";
import error from "app/App/Error";
import axios from "app/App/axios";
import { createSchedule } from "./createSchedule";
// import { InitializeSession } from 'app/Vocabulary/actions/session'
import { getUserFromCookie, isUserLoggedIn } from "app/User/actions";
import {
  saveInLocalStorage,
  getFromLocalStorage,
} from "app/App/functions/localStorage";
import { deck } from "app/Vocabulary/actions/deck";
import { now } from "app/App/functions/time.js";
export const SESSION_PREFIX = "session_";

/*
  User data is stored on {
    user_id,
    lastSynced,
    data: { 
      key: { 
        value,
        needsSyncing,
      }
    }
  }

  TODO: skrá notanda í gögn!
*/
export const sync = async (options = {}) => {
  let { user_data, lastSynced } =
    deck || getFromLocalStorage("vocabulary-user-data") || {};

  // schedule = schedule || {};

  // if (getFromLocalStorage("vocabulary-session-remaining")) {
  //   session_log.push({
  //     //       seconds_spent
  //     // timestamp
  //   });
  // }

  // saveInLocalStorage("vocabulary-user-data", {
  //   schedule,
  //   session_log,
  //   easinessLevel,
  //   lastSynced,
  // });

  if (!isUserLoggedIn()) {
    console.log(`Not synced to server as user isn't logged in`);
    return;
  }

  const unsynced = getUnsynced(user_data);

  const response = (
    await axios.post(`/api/vocabulary/sync`, {
      unsynced,
      lastSynced: (Object.keys(unsynced).length > 0 && lastSynced) || 0,
    })
  ).data;

  // // console.log({ response });

  const data = {
    user_data: mergeResponse(user_data, response.user_data),
    lastSynced: response.lastSynced,
  };

  // saveUserDataInLocalStorage(data, { assignToDeck: true });
  // console.log("Data synced");
  // return data;
};

export const setUserData = (key, value) => {
  deck.user_data[key] = {
    value,
    needsSyncing: now(),
  };
  saveUserDataInLocalStorage();
};
export const saveScheduleForCardId = (card_id) => {
  setUserData(card_id, deck.schedule[card_id]);
};

export const syncIfNecessary = async () => {
  // if (!deck) return;
  // const user_data = getFromLocalStorage("vocabulary-user-data");
  // /* Localstorage data has been updated in another tab, so we reload */
  // if (user_data) {
  //   if (user_data.lastSaved > deck.lastSaved) {
  //     saveUserDataInLocalStorage(user_data, { assignToDeck: true });
  //   }
  // }
  // if (isUserLoggedIn()) {
  //   /* Sync if more than 10 minutes since sync */
  //   if (now() > deck.lastSynced + 10 * 60 * 1000) {
  //     await sync();
  //   }
  // }
};

/* TODO set timeout */
export const saveUserDataInLocalStorage = (input, options = {}) => {
  // if (!input && !deck) return;
  // const toSave = {
  //   schedule: (input || deck)?.schedule,
  //   session_log: (input || deck)?.session_log,
  //   easinessLevel: (input || deck)?.easinessLevel,
  //   lastSynced: (input || deck)?.lastSynced,
  //   lastSaved: now(),
  // };
  // saveInLocalStorage("vocabulary-user-data", toSave);
  // if (options.assignToDeck) {
  //   if (deck) {
  //     Object.assign(deck, toSave);
  //   }
  // }
};

const getUnsynced = (obj, options) => {
  if (!obj) return {};
  const { syncEverything } = options;
  let to_save = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key].needsSyncing || syncEverything) {
      to_save[key] = obj[key];
    }
  });
  return to_save;
};
const mergeResponse = (local, server) => {
  Object.keys(local).forEach((key) => {
    delete local[key].needsSyncing;
  });
  Object.keys(server).forEach((key) => {
    local[key] = { value: server[key] };
  });
  return local;
};
