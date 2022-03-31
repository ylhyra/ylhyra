import { UserInfo } from "ylhyra/app/user/actions";

export const user = (state: UserInfo | null = null, action): UserInfo => {
  switch (action.type) {
    case "LOAD_USER":
      return action.content;
    default:
      return state;
  }
};
