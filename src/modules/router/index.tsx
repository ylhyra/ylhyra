import { createBrowserHistory } from "history";
import { createObservableHistory } from "mobx-observable-history";
import { isBrowser } from "modules/isBrowser";
import React from "react";

export const customHistory = isBrowser
  ? createObservableHistory(createBrowserHistory())
  : null;

export function goToUrl(url: string) {
  if (!customHistory) return;
  customHistory.replace(url);
}
