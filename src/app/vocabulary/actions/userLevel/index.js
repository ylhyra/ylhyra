import { getUserData, setUserData } from "app/vocabulary/actions/sync";

export const BEGINNER = 1;
export const NOVICE = 2;
export const INTERMEDIATE = 3;
export const ADVANCED = 4;

export const setUserLevel = (val) => {
  setUserData("userLevel", val);
};

export const getUserLevel = () => {
  const val = getUserData("userLevel");
  return val ? parseInt(val) : null;
};
