import { isBrowser } from "ylhyra/app/app/functions/isBrowser";

type RouteState = { pathname: string; data?: Object };
export const route = (
  state: RouteState = {
    pathname: isBrowser ? window.location.pathname : "/",
  },
  action
): RouteState => {
  switch (action.type) {
    case "ROUTE":
      return {
        ...state,
        ...action.content,
      };
    case "LOAD_ROUTE_CONTENT":
      return {
        ...state,
        data: action.data,
      };
    default:
      return state;
  }
};
