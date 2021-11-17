import { Brand } from "ts-brand";
import { Days, Timestamp } from "app/app/functions/time";

export interface ScheduleData {
  due: Timestamp;
  last_interval_in_days: Days;
  score: number;
  last_seen: Timestamp;
  sessions_seen: number;

  /* Í VINNSLU */
  last_bad_timestamp: Timestamp;
  number_of_bad_sessions: number;
}

export type CardId = Brand<string, "CardId">;
export type CardIds = Array<CardId>;
export type TermId = Brand<string, "TermId">;
export type TermIds = Array<TermId>;
// export type CardId = string & { CardId: "CardId" };
