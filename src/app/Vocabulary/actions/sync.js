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

export const sync = async (options = {}) => {
  const userData = getFromLocalStorage("vocabulary-user-data");
  let { schedule, session_log, easinessLevel, lastSynced } =
    deck || userData || {};

  schedule = schedule || {};
  session_log = session_log || [];

  if (getFromLocalStorage("vocabulary-session-remaining")) {
    session_log.push({
      //       seconds_spent
      // timestamp
    });
  }

  saveInLocalStorage("vocabulary-user-data", {
    schedule,
    session_log,
    easinessLevel,
    lastSynced,
  });

  if (!isUserLoggedIn()) {
    console.log(`Not synced to server as user isn't logged in`);
    return;
  }

  const response = (
    await axios.post(`/api/vocabulary/sync`, {
      schedule: getUnsynced(schedule, options),
      session_log: getUnsynced(session_log, options),
      easinessLevel,
      lastSynced: lastSynced,
    })
  ).data;

  const data = {
    schedule: saveScheduleResponse(schedule, response.schedule),
    session_log: saveSessionLogResponse(session_log, response.session_log),
    easinessLevel: response.easinessLevel || easinessLevel || 0,
    lastSynced: response.lastSynced,
  };

  saveUserDataInLocalStorage(data, true);
  console.log("Data synced");
  return data;
};
// window.syncSchedule = syncSchedule;

export const syncIfNecessary = async () => {
  if (!deck) return;
  const userData = getFromLocalStorage("vocabulary-user-data");
  /* Localstorage data has been updated in another tab, so we reload */
  if (userData) {
    if (userData.lastSaved > deck.lastSaved) {
      saveUserDataInLocalStorage(userData, true);
    }
  }
  if (isUserLoggedIn()) {
    /* Sync if more than 10 minutes since sync */
    if (new Date().getTime() > deck.lastSynced + 10 * 60 * 1000) {
      await sync();
    }
  }
};

export const saveUserDataInLocalStorage = (input, assign) => {
  if (!input && !deck) return;
  const toSave = {
    schedule: (input || deck)?.schedule,
    session_log: (input || deck)?.session_log,
    easinessLevel: (input || deck)?.easinessLevel,
    lastSynced: (input || deck)?.lastSynced,
    lastSaved: new Date().getTime(),
  };
  saveInLocalStorage("vocabulary-user-data", toSave);
  if (assign) {
    if (deck) {
      Object.assign(deck, toSave);
    }
  }
};

const getUnsynced = (obj, options) => {
  if (!obj) return null;
  const { syncEverything } = options;
  if (Array.isArray(obj)) {
    return obj.filter((v) => v.needsSyncing || syncEverything);
  } else {
    let to_save = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key].needsSyncing || syncEverything) {
        to_save[key] = obj[key];
      }
    });
    return to_save;
  }
};
const saveScheduleResponse = (schedule, updated) => {
  Object.keys(schedule).forEach((card_id) => {
    if (schedule[card_id].needsSyncing) {
      schedule[card_id].needsSyncing = false;
    }
  });
  Object.keys(updated).forEach((card_id) => {
    if (schedule[card_id]?.needsSyncing) return;
    schedule[card_id] = updated[card_id];
  });
  return schedule;
};
const saveSessionLogResponse = (session_log, updated) => {
  session_log = session_log
    .map((j) => ({
      ...j,
      needsSyncing: false,
    }))
    .concat(updated);
};
