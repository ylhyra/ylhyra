export const getCardIds = () => {
  return this.cards;
};

export const getCardIdsShuffledIfSeen = () => {
  if (
    this.getCards().some((card) => card.isInSchedule()) &&
    Math.random() > 0.5
  ) {
    return this.getCardIds().reverse();
  } else {
    return this.getCardIds();
  }
};
