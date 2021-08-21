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
  const savedUserData = getFromLocalStorage("user-data");
  let { schedule, session_log, easinessLevel, lastSynced } =
    deck || savedUserData || {};

  saveInLocalStorage("user-data", {
    schedule,
    session_log,
    easinessLevel,
    lastSynced,
  });

  if (!isUserLoggedIn()) {
    console.log(`Not synced to server as user isn't logged in`);
    return;
  }

  schedule = schedule || {};
  session_log = session_log || [];

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

  saveInLocalStorage("user-data", data);
  if (deck) {
    Object.assign(deck, data);
  }
  console.log("Data synced");
  return data;
};
// window.syncSchedule = syncSchedule;

export const syncIfNecessary = async () => {
  if (!deck) return;

  await sync();
};

export const saveUserData = () => {
  // saveInLocalStorage(key, value);
  // saveInLocalStorage(key+'', val);
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
