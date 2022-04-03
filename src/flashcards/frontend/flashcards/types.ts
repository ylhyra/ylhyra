export type Card = {
  id: string;
  question: string;
  answer: string;
  deckId: string;
  createdAt: string;
  updatedAt: string;
};

export type Deck = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CardInputData = {
  front: string;
  back: string;
  deckId: string;
};

export type DeckSettings = {};
