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
    user_data = {
      user_id,
      lastSynced,
      rows: { 
        key: { 
          value,
          needsSyncing,
        }
      }
    }

  TODO: skrá notanda í gögn!
*/
export const sync = async (options = {}) => {
  let user_data = deck || getFromLocalStorage("vocabulary-user-data") || {};
  let rows = user_data.rows || {};
  const { lastSynced } = user_data;

  saveUserDataInLocalStorage({ rows });

  if (!isUserLoggedIn()) {
    console.log(`Not synced to server as user isn't logged in`);
    return;
  }

  const unsynced = getUnsynced(rows, options);

  const response = (
    await axios.post(`/api/vocabulary/sync`, {
      unsynced,
      lastSynced: (Object.keys(unsynced).length > 0 && lastSynced) || 0,
    })
  ).data;

  rows = mergeResponse(rows, response.user_data);
  const schedule = {};
  Object.keys(rows).forEach((key) => {
    if (rows[key].type === "schedule") {
      schedule[key] = rows[key].value;
    }
  });

  user_data = {
    rows,
    lastSynced: response.lastSynced,
  };

  saveUserDataInLocalStorage({ rows }, { assignToDeck: true });
  console.log("Data synced");
  return {
    user_data,
    schedule,
  };
};

export const setUserData = (key, value, type) => {
  deck.user_data.rows[key] = {
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
  // TODO
  // const data = getFromLocalStorage("vocabulary-user-data");
  // /* Localstorage data has been updated in another tab, so we reload */
  // if (data) {
  //   if (data.lastSaved > deck.lastSaved) {
  //     saveUserDataInLocalStorage(data, { assignToDeck: true });
  //   }
  // }
  // if (isUserLoggedIn()) {
  //   /* Sync if more than 10 minutes since sync */
  //   if (now() > deck.lastSynced + 10 * 60 * 1000) {
  //     // TODO
  //     await sync();
  //   }
  // }
};

let timer;
export const saveUserDataInLocalStorage = (user_data = {}, options = {}) => {
  const toSave = {
    ...(deck?.user_data || {}),
    ...user_data,
    lastSaved: now(),
  };
  if (deck && options.assignToDeck) {
    Object.assign(deck, toSave);
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
