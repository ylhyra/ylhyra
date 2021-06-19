import { combineReducers } from "redux";
import { getUserFromCookie } from "./actions";

export const user = (state = null, action) => {
  switch (action.type) {
    case "LOAD_USER":
      return action.content;
    default:
      return state;
  }
};
