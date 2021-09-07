export const oldestFirst = (cards) => {
  return cards.sort((a, b) => a.getTermLastSeen() - b.getTermLastSeen());
};

export const newestFirst = (cards) => {
  return oldestFirst(cards).reverse();
};

export const sortCardsByScore = (cards) => {
  return cards.sort((a, b) => a.getScore() - b.getScore());
};

export const sortBySortKey = (cards) => {
  return cards.sort((a, b) => a.sortKey - b.sortKey);
};
