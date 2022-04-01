import { deck } from "ylhyra/app/vocabulary/actions/deck";

export const SESSION_PREFIX = "s_";

export const getSessions = (): Array<any> => {
  const sessions = [];
  Object.keys(deck?.user_data?.rows || {}).forEach((key) => {
    if (deck.user_data.rows[key].type === "session") {
      sessions.push(deck.user_data.rows[key].value);
    }
  });
  return sessions;
};

// export const getLastSessionTimestamp = () => {
//   let max = 0;
//   Object.keys(deck?.user_data?.rows || {}).forEach((key) => {
//     if (deck.user_data.rows[key].type === "session") {
//       sessions.push(deck.user_data.rows[key].value);
//     }
//   });
//   return sessions;
// };
