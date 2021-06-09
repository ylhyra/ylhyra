const query = require('./../../database/functions/query')
const request = require('request')
const _ = require('underscore')
const { getUserLevel, increaseUserLevel } = require('./level')


module.exports = (req, res) => {
  req.session.started = true

  const currentlyShown = req.body.currentlyShownWords || []

  getCards(req, res, currentlyShown, cards => {
    console.log('Cards: ' + cards.length)
    // console.log(scheduleResults[0])
    // send(res, cards)
    res.send(cards)
  })
}


const getCards = async (req, res, currentlyShown, callback) => {
  const level = await getUserLevel(req)
  query(`
    SELECT
      cards.*,
      log1.word_score,
      log1.variation_score,
      log1.card_score,
      log1.timestamp AS lastSeenCard,
      log2.timestamp AS lastSeenVariation,
      log3.timestamp AS lastSeenWord
    FROM
    (

      -- Scheduled words
      (SELECT vocabulary_words.*, due FROM vocabulary_schedule
        NATURAL JOIN vocabulary_words
        WHERE user = ?
        LIMIT 20)

      UNION

      -- All words in level
      (SELECT *, null FROM vocabulary_words AS words
		    ORDER BY ABS(words.level - ?)
      	LIMIT 40)

    ) as words
    NATURAL JOIN vocabulary_cards AS cards
    LEFT JOIN vocabulary_log log1 ON (log1.user = ? AND log1.card_id = cards.card_id)
    LEFT JOIN vocabulary_log log2 ON (log2.user = ? AND log2.variation_id = cards.variation_id)
    LEFT JOIN vocabulary_log log3 ON (log3.user = ? AND log3.word_id = cards.word_id)
    WHERE TRUE
    ${'AND word_id != ? '.repeat(currentlyShown.length)}
  `, [
    req.session.userid,
    level,
    req.session.userid,
    req.session.userid,
    req.session.userid,
    ...currentlyShown,
  ], (err, results) => {
    if (err) {
      console.error(err)
      console.error(err.sql);
      res.send(null)
    } else {
      mix(results, level, callback)
      shouldLevelBeIncreased(results, level, req)
    }
  })
}

const shouldLevelBeIncreased = (results, level, req) => {
  const inLevelWithLowScore = results
    .filter(i => i.level == level)
    .filter(i => i.word_score < 0.6)

  if (inLevelWithLowScore.length == 0) {
    increaseUserLevel(req, level)
  }
}

const mix = (results, level, callback) => {
  let Chosen = {
    ChosenCards: [],
    ChosenIds: [],
    ChosenTypes: [],
    Remaining: 30,
  }

  /******/

  let New = {
    previousLevel: [],
    currentLevel: [],
    nextLevel: [],
  }
  let Scheduled = {
    previousLevel: [],
    currentLevel: [],
    nextLevel: [],
  }

  results.forEach(card => {
    if (card.due) {
      if (card.level < level) {
        Scheduled.previousLevel.push(card)
      } else if (card.level == level) {
        Scheduled.currentLevel.push(card)
      } else {
        Scheduled.nextLevel.push(card)
      }
    } else {
      if (card.level < level) {
        New.previousLevel.push(card)
      } else if (card.level == level) {
        New.currentLevel.push(card)
      } else {
        New.nextLevel.push(card)
      }
    }
  })

  Scheduled.currentLevel = Scheduled.currentLevel.pipe(_.shuffle)
  New.currentLevel = New.currentLevel.pipe(_.shuffle)
  Scheduled.nextLevel = Scheduled.nextLevel.pipe(_.shuffle).sort((a, b) => a.level - b.level)
  New.nextLevel = New.nextLevel.pipe(_.shuffle).sort((a, b) => b.level - a.level)
  Scheduled.previousLevel = Scheduled.previousLevel.pipe(_.shuffle).sort((a, b) => a.level - b.level)
  New.previousLevel = New.previousLevel.pipe(_.shuffle).sort((a, b) => b.level - a.level)

  /******/

  Chosen = Select(Scheduled.currentLevel, Chosen, 25)
  Chosen = Select(New.currentLevel, Chosen, 25)
  Chosen = Select(Scheduled.previousLevel, Chosen, 10)
  Chosen = Select(New.previousLevel, Chosen, 10)
  Chosen = Select(Scheduled.nextLevel, Chosen, 5)
  Chosen = Select(New.nextLevel, Chosen, 5)

  /******/


  Chosen.ChosenCards
    .pipe(_.shuffle)
    .slice(0, 30)
    .map(parseCard)
    .map(addOptions)
    .pipe(callback)
}


const Select = (cards, { ChosenCards, ChosenIds, ChosenTypes, Remaining }, max) => {
  if (Remaining > 0) {

    cards.forEach(card => {
      if (Remaining == 0 || max == 0) return;
      if (ChosenIds.includes(card.word_id)) return;

      let possibleCards = []
      cards
        .filter(i => i.word_id == card.word_id)
        .forEach(i => {
          possibleCards.push({
            card: i,
            odds: getOdds(i.type, ChosenTypes)
          })
        })

      const chosenCard = possibleCards.sort((a, b) => { return b.odds - a.odds })[0].card

      ChosenCards.push(chosenCard)
      ChosenTypes.push(chosenCard.type)
      ChosenIds.push(chosenCard.word_id)
      Remaining--;
      max--;
    })

  }
  return { ChosenCards, ChosenIds, ChosenTypes, Remaining }
}


const getOdds = (type, otherTypes) => {
  let count = 0
  for (const x of otherTypes) {
    if (x == type) {
      count++
    }
  }
  if (count == 0 || otherTypes.length == 0) {
    return 1
  }
  return 1 - (count / otherTypes.length)
}


/*
  Parses JSON encoded information about card
  TODO Should be in frontend
*/
const parseCard = ({ card, ...rest }) => {
  return {
    ...rest,
    ...JSON.parse(card),
  }
}

const addOptions = (card) => {
  if (card.options) {
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

const getRandom = () => {
  return Math.random().toFixed(2) * 100
}

Object.defineProperty(Object.prototype, 'pipe', {
  value: function(transform) { return transform(this); }
})
