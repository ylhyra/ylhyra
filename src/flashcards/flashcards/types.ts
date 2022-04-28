export type Card = {
  id: string;
  front: string;
  back: string;
  // deckId: string;
  // createdAt: string;
  // updatedAt: string;
};
export type CardsObject = Record<Card["id"], Card>;

export type Deck = {
  id: string;
  title: string;
  topic?: string;
  // createdAt: string;
  // updatedAt: string;
  cards: CardsObject;
};
export type DecksObject = Record<Deck["id"], Deck>;

export type CardInputData = {
  front: string;
  back: string;
  deckId: string;
};

export type DeckSettings = {};
