import _ from 'underscore'

/*
  Randomizes the options for multiple choice cards.
  On the input, the correct value is the first value.
*/
export const randomizeOptions = (card) => {
  if (card && card.options && (['multiple choice', 'listen'].includes(card.type))) {
    const numberOfOptions = Math.random() > 0.6 ? 2 : 3
    const correct_index = randomInt(0, numberOfOptions - 1)
    const options = [
      card.options[0],
      ..._.shuffle(card.options.slice(1)).slice(0, numberOfOptions - 1),
    ]
    return {
      ...card,
      correct_index,
      options: [
        ...options.slice(-correct_index),
        ...options.slice(0, -correct_index),
      ]
    }
  }
  return card
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
