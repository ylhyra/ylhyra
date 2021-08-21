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

  if (!isUserLoggedIn()) {
    console.log(`Not synced to server as user isn't logged in`);
    return;
  }

  const response = await axios.post(`/api/vocabulary/sync`, {
    schedule: schedule && getUnsynced(schedule, options),
    session_log: session_log && getUnsynced(session_log, options),
    easinessLevel,
    lastSynced: lastSynced,
  });

  schedule = saveScheduleResponse(schedule, response.schedule);
  session_log = saveSessionLogResponse(session_log, response.session_log);
  easinessLevel = response.easinessLevel || easinessLevel || 0;
  lastSynced = response.lastSynced;

  saveInLocalStorage("user-data", {
    schedule,
    easinessLevel,
    session_log,
    lastSynced,
  });
  console.log("Data synced");

  if (deck) {
    deck.schedule = schedule;
    deck.easinessLevel = easinessLevel;
    deck.session_log = session_log;
    deck.lastSynced = lastSynced;
  } else {
    return {
      schedule,
      easinessLevel,
      session_log,
      lastSynced,
    };
  }
};
// window.syncSchedule = syncSchedule;

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
  updated.forEach((i) => {
    if (schedule[i.card_id]?.needsSyncing) return;
    schedule[i.card_id] = { ...i, id: i.card_id };
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
