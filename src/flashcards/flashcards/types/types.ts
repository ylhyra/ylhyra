/**
 * Raw entry in database
 */
export type RawCard = {
  id: string;
  front: string;
  back: string;
  direction?: DirectionSettings;
  automaticDependencies?: Boolean;
  automaticallyDependOnThis?: Boolean;
  // deckId: string;
  // createdAt: string;
  // updatedAt: string;
};
export type CardsObject = Record<RawCard["id"], RawCard>;

export type Deck = {
  id: string;
  cards: CardsObject;
} & DeckSettings;
export type DecksObject = Record<Deck["id"], Deck>;

export type DeckSettings = Partial<{
  title: string;
  topic?: string;
  preset?:
    | "FOREIGN_LANGUAGE_PERSONAL_USE"
    | "FOREIGN_LANGUAGE_FOR_OTHERS"
    | "NONE";
  fromLanguage: string;
  toLanguage: string;
  direction?: DirectionSettings;
  sideToShowFirst?: "FRONT_SIDE" | "RANDOM";
  automaticDependencies?: Boolean;
  automaticallyOccludeClashing?: Boolean;
  scheduling?: {
    goal: "MEMORIZE_PERFECTLY" | "MEMORIZE_WELL" | "SEE_MANY_CARDS" | "CRAM";
    newCardsPrioritization:
      | "PRIORITIZE_LOWER_RANK"
      | "PRIORITIZE_IMPORTANCE"
      | "PRIORITIZE_RECENTLY_ADDED";
    seenCardsPrioritization:
      | "PRIORITIZE_LOWER_RANK"
      | "PRIORITIZE_IMPORTANCE"
      | "PRIORITIZE_RECENTLY_SEEN";
  };
  stringReplacements: [];
  automaticReplacementsToFindAlternativeId: [];
  /**
   * When the user is playing from all decks at once,
   * this multiplier can be used to make certain decks more important
   * than others
   */
  deckImportanceMultiplier?: Number;
  /**
   * Choose between "Bad - Good" or "Bad - Good - Easy"
   */
  numberOfRatingButtons: 3 | 2;
}>;

export type DirectionSettings = "BOTH" | "FRONT_TO_BACK" | "BACK_TO_FRONT";

export type CardInputData = {
  front: string;
  back: string;
  deckId: string;
};

export enum ImportanceEnum {
  VERY_UNIMPORTANT = 1,
  UNIMPORTANT = 2,
  NORMAL_IMPORTANCE = 3,
  IMPORTANT = 4,
  VERY_IMPORTANT = 5,
}
export enum CefrEnum {
  A1 = 1,
  A2 = 2,
  B1 = 3,
  B2 = 4,
  C1 = 5,
  C2 = 6,
}
export enum Rating {
  BAD = 1,
  GOOD = 2,
  EASY = 3,
}
