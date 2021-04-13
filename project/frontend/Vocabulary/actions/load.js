
export const loadDeck = async (input) => {
  if(!input) {
    const { data } = await axios.get(`${url}/api/vocabulary`)
    input = input || data
  }
  console.log(input)
  if (Array.isArray(input)) {
    deck = new Deck(input)
    deck.next()
    loadCard()
  } else {
    // TODO!!
    // ERROR
  }
}
