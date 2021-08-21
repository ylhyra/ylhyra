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

/**
 * @memberof Deck
 */
export default async function (options = {}) {
  const deck = this;
  const { schedule } = deck;
  if (!schedule) return;
  // saveInLocalStorage("vocabulary-schedule", schedule);
  if (!isUserLoggedIn()) {
    console.log(`Not synced to server as user isn't logged in`);
    return;
  }

  const response = await axios.post(`/api/vocabulary/sync`, {
    schedule: getUnsynced(schedule, options),
    sessions: getUnsynced(sessions, options),
    easinessLevel,
    lastSynced: getFromLocalStorage("user-data-last-synced"),
  });

  // if (Object.keys(tosave).length > 0) {
  //   await axios.post(`/api/vocabulary/save`, { schedule: tosave });
  //   Object.keys(schedule).forEach((card_id) => {
  //     if (schedule[card_id].needsSyncing) {
  //       schedule[card_id].needsSyncing = false;
  //     }
  //   });
  //   // saveInLocalStorage("vocabulary-schedule", schedule);
  // }

  /* TODO: Selective sync */
  const r = (await axios.post(`/api/vocabulary/schedule`)).data;
  if (r) {
    r.forEach((i) => {
      /* TODO: Hvað ef server er undan á? */
      if (schedule[i.card_id]?.needsSyncing) return;
      schedule[i.card_id] = { ...i, id: i.card_id };
    });
  }

  saveInLocalStorage("user-data", {
    schedule,
    easinessLevel,
    sessions,
    lastSynced: new Date().getTime(),
  });
  console.log("Data synced");
}
// window.syncSchedule = syncSchedule;

const getUnsynced = (obj, options) => {
  const { syncEverything } = options;
  /* Selective sync */
  let to_save = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key].needsSyncing || syncEverything) {
      to_save[key] = obj[key];
    }
  });
  return to_save;
};
