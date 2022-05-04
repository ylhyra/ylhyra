import {
  setUserData,
  UserData,
} from "flashcards/flashcards/actions/userData/userData";

export const getScheduleFromUserData = (
  userData: UserData
): { [cardId: string]: ScheduleData } => {
  const schedule = {};
  Object.keys(userData?.rows || {}).forEach((key) => {
    if (userData.rows[key].type === "schedule") {
      schedule[key] = userData.rows[key].value;
    }
  });
  return schedule;
};

export const saveScheduleForCardId = (cardId: CardId) => {
  setUserData(cardId, deck!.schedule[cardId], "schedule");
};
