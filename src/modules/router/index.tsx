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

import { useLayoutEffect, useState } from "react";
import { BrowserRouterProps, Router } from "react-router-dom";
import { BrowserHistory, createBrowserHistory } from "history";
interface Props extends BrowserRouterProps {
  history: BrowserHistory;
}

export const customHistory = createBrowserHistory();

export const CustomRouter = ({ basename, history, children }: Props) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });
  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      navigator={customHistory}
      location={state.location}
      navigationType={state.action}
      children={children}
      basename={basename}
    />
  );
};