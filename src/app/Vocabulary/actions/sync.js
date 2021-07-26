import store from "app/App/store";
import error from "app/App/Error";
import axios from "app/App/axios";
import { createSchedule } from "./createSchedule";
// import { InitializeSession } from 'app/Vocabulary/actions/session'

import {
  saveInLocalStorage,
  getFromLocalStorage,
} from "app/App/functions/localStorage";

export async function syncSchedule(options) {
  const deck = this;
  const { schedule } = deck;
  const syncEntireSchedule = options?.syncEntireSchedule;
  if (!schedule) return;
  saveInLocalStorage("vocabulary-schedule", schedule);
  if (!(store.getState().user && store.getState().user.user_id)) {
    console.log(`Not synced to server as user isn't logged in`);
    return;
  }

  /* Selective sync */
  let tosave = {};
  Object.keys(schedule).forEach((card_id) => {
    if (schedule[card_id].needsSyncing || syncEntireSchedule) {
      tosave[card_id] = schedule[card_id];
    }
  });
  if (Object.keys(tosave).length > 0) {
    await axios.post(`/api/vocabulary/save`, { schedule: tosave });
    Object.keys(schedule).forEach((card_id) => {
      if (schedule[card_id].needsSyncing) {
        schedule[card_id].needsSyncing = false;
      }
    });
    saveInLocalStorage("vocabulary-schedule", schedule);
  }
}
// window.syncSchedule = syncSchedule;
