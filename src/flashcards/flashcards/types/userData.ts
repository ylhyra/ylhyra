import { Timestamp } from "modules/time";

export type UserData = {
  lastSynced?: Timestamp;
  rows: UserDataRows;
  /** TODO */
  user_id?: string;
};

export type UserDataRows = {
  [keys: string]: {
    value: string;
    type: "schedule" | "session" | null | undefined;
    needsSyncing?: boolean;
  };
};
