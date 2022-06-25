import store from "ylhyra/app/app/store";
import {
  getUserData,
  setUserData,
} from "ylhyra/vocabulary/app/actions/userData/userData";
import {
  USER_LEVEL_ADVANCED,
  USER_LEVEL_BEGINNER,
  USER_LEVEL_INTERMEDIATE,
  USER_LEVEL_NOVICE,
} from "ylhyra/vocabulary/app/constants";

export function setUserLevel(val) {
  setUserData("level", val);
  /* Currently only used to refresh the interface, does not store any data */
  store.dispatch({ type: "SET_USER_LEVEL", content: val });
}

export const getUserLevel = () => {
  const val = getUserData("level");
  return val ? parseInt(val) : null;
};

export const printUserLevel = () => {
  switch (getUserLevel()) {
    case USER_LEVEL_BEGINNER:
      return "Beginner";
    case USER_LEVEL_NOVICE:
      return "Novice";
    case USER_LEVEL_INTERMEDIATE:
      return "Intermediate";
    case USER_LEVEL_ADVANCED:
      return "Advanced";
    default:
      return "";
  }
};
