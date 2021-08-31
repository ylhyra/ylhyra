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
export const SESSION_PREFIX = "s_";

/*
  User data is stored on 
    {
      user_id,
      lastSynced,
      user_data: { 
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

  user_data = user_data || {};

  // if (getFromLocalStorage("vocabulary-session-remaining")) {
  //   session_log.push({
  //     //       seconds_spent
  //     // timestamp
  //   });
  // }

  saveUserDataInLocalStorage(user_data);

  if (!isUserLoggedIn()) {
    console.log(`Not synced to server as user isn't logged in`);
    return;
  }

  const unsynced = getUnsynced(user_data, options);

  const response = (
    await axios.post(`/api/vocabulary/sync`, {
      unsynced,
      lastSynced: (Object.keys(unsynced).length > 0 && lastSynced) || 0,
    })
  ).data;

  user_data = mergeResponse(user_data, response.user_data);
  const schedule = {};
  Object.keys(user_data).forEach((key) => {
    if (user_data[key].type === "schedule") {
      schedule[key] = user_data[key].value;
    }
  });

  const data = {
    user_data,
    schedule,
    lastSynced: response.lastSynced,
  };
  console.log({ data });

  saveUserDataInLocalStorage(data, { assignToDeck: true });
  console.log("Data synced");
  return data;
};

export const setUserData = (key, value, type) => {
  deck.user_data[key] = {
    value,
    needsSyncing: now(),
    type,
  };
  saveUserDataInLocalStorage();
};
export const saveScheduleForCardId = (card_id) => {
  setUserData(card_id, deck.schedule[card_id], "schedule");
};

export const syncIfNecessary = async () => {
  if (!deck) return;
  const data = getFromLocalStorage("vocabulary-user-data");
  /* Localstorage data has been updated in another tab, so we reload */
  if (data) {
    if (data.lastSaved > deck.lastSaved) {
      saveUserDataInLocalStorage(data, { assignToDeck: true });
    }
  }
  if (isUserLoggedIn()) {
    /* Sync if more than 10 minutes since sync */
    if (now() > deck.lastSynced + 10 * 60 * 1000) {
      // TODO
      await sync();
    }
  }
};

let timer;
export const saveUserDataInLocalStorage = (data, options = {}) => {
  if (!data && !deck) return;
  const toSave = {
    ...data,
    lastSaved: now(),
  };
  if (options.assignToDeck) {
    if (deck) {
      Object.assign(deck, toSave);
    }
  }
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    saveInLocalStorage("vocabulary-user-data", toSave);
  }, 1000);
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
    local[key] = server[key];
  });
  return local;
};
