// import { makeAutoObservable } from "mobx";
//
// export class routeStore {
//   route = "";
//   constructor() {
//     makeAutoObservable(this);
//   }
//   updateUrl = (url) => {
//     this.route = url;
//   };
// }

import { BrowserHistory, createBrowserHistory } from "history";
import { isBrowser } from "modules/isBrowser";
import React, { useLayoutEffect, useState } from "react";
import { BrowserRouterProps, Router } from "react-router-dom";

interface Props extends BrowserRouterProps {
  history: BrowserHistory;
}

export const customHistory = isBrowser ? createBrowserHistory() : null;

export const goToUrl = (url: string) => {
  if (!customHistory) return;
  goToUrl(url);
};

export const CustomRouter = ({ basename, history, children }: Props) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });
  useLayoutEffect(() => history.listen(setState), [history]);

  if (isBrowser) {
    return (
      <Router
        navigator={customHistory!}
        location={state.location}
        navigationType={state.action}
        children={children}
        basename={basename}
      />
    );
  } else {
    return <>{children}</>;
  }
};
