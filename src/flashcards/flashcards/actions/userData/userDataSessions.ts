export const SESSION_PREFIX = "s_";

export const getSessions = (): Array<any> => {
  const sessions = [];
  Object.keys(getUserData().rows || {}).forEach((key) => {
    if (getUserData().rows[key].type === "session") {
      sessions.push(getUserData().rows[key].value);
    }
  });
  return sessions;
};

// export const getLastSessionTimestamp = () => {
//   let max = 0;
//   Object.keys(getUserData().rows || {}).forEach((key) => {
//     if (getUserData().rows[key].type === "session") {
//       sessions.push(getUserData().rows[key].value);
//     }
//   });
//   return sessions;
// };
