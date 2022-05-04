import { Brand } from "ts-brand";

declare global {
  type CardId = Brand<string, "CardId">;
  type CardIds = Array<CardId>;
  type TermId = Brand<string, "TermId">;
  type TermIds = Array<TermId>;
}
