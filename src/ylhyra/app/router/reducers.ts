import { isBrowser } from "modules/isBrowser";
import { RouteContent } from "ylhyra/app/router/actions/goToUrl";

type RouteState = {
  pathname: string;
  data?: RouteContent;
  section?: string;
  is404?: Boolean;
};

export const route = (
  state: RouteState = {
    pathname: isBrowser ? window.location.pathname : "/",
  },
  action: { type: string; content?: RouteState }
): RouteState => {
  switch (action.type) {
    case "ROUTE":
      return action.content!;
    case "ROUTE_404":
      return {
        ...state,
        is404: true,
      };
    default:
      return state;
  }
};
