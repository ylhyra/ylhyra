export type Flashcard = {
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

export type FlashcardInputData = {
  question: string;
  answer: string;
  deckId: string;
};

export type DeckSettings = {};
