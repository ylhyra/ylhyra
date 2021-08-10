import { isBrowser } from "app/App/functions/isBrowser";
export const route = (
  state = {
    pathname: isBrowser ? window.location.pathname : "/",
  },
  action
) => {
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
