import store from "app/App/store";
import error from "app/App/Error";
import axios from "app/App/axios";
import { createSchedule } from "./createSchedule";
// import { InitializeSession } from 'app/Vocabulary/actions/session'

import {
  saveInLocalStorage,
  getFromLocalStorage,
} from "app/App/functions/localStorage";

export async function syncSchedule() {
  const deck = this;
  saveInLocalStorage("vocabulary-schedule", deck.schedule);

  /* TODO selective sync */
  await axios.post(`/api/vocabulary/save`, {
    schedule: deck.schedule,
    user: store.getState().user,
  });
}
