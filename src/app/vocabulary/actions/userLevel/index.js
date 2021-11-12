import store from "app/app/store";
import {
  getUserData,
  setUserData,
} from "app/vocabulary/actions/userData/userData";

export const BEGINNER = 1;
export const NOVICE = 2;
export const INTERMEDIATE = 3;
export const ADVANCED = 4;

export const setUserLevel = (val) => {
  setUserData("userLevel", val);
  /* Currently only used to refresh the interface, does not store any data */
  store.dispatch({ type: "SET_USER_LEVEL", content: val });
};

export const getUserLevel = () => {
  const val = getUserData("userLevel");
  return val ? parseInt(val) : null;
};

export const printUserLevel = () => {
  switch (getUserLevel()) {
    case BEGINNER:
      return "Beginner";
    case NOVICE:
      return "Novice";
    case INTERMEDIATE:
      return "Intermediate";
    case ADVANCED:
      return "Advanced";
    default:
      return "";
  }
};
