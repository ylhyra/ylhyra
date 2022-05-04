export const SESSION_PREFIX = "s_";

export const getSessions = (): Array<any> => {
  const sessions = [];
  Object.keys(deck?.userData?.rows || {}).forEach((key) => {
    if (deck!.userData.rows[key].type === "session") {
      sessions.push(deck!.userData.rows[key].value);
    }
  });
  return sessions;
};

// export const getLastSessionTimestamp = () => {
//   let max = 0;
//   Object.keys(deck?.userData?.rows || {}).forEach((key) => {
//     if (deck!.userData.rows[key].type === "session") {
//       sessions.push(deck!.userData.rows[key].value);
//     }
//   });
//   return sessions;
// };
