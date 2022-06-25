import { getUserData } from "flashcards/flashcards/actions/userData/userDataStore";

export const SESSION_PREFIX = "s_";

export function getSessions(): any[] {
  const sessions = [];
  Object.keys(getUserData().rows || {}).forEach((key) => {
    if (getUserData().rows[key].type === "session") {
      sessions.push(getUserData().rows[key].value);
    }
  });
  return sessions;
}

// export function getLastSessionTimestamp () {
//   let max = 0;
//   Object.keys(getUserData().rows || {}).forEach((key) => {
//     if (getUserData().rows[key].type === "session") {
//       sessions.push(getUserData().rows[key].value);
//     }
//   });
//   return sessions;
// };
