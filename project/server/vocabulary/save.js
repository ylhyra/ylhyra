/**
 * Saves session and updates schedule
 */
import query from 'server/database'
const router = (require('express')).Router()
import shortid from 'shortid'
import sql from 'server/database/functions/SQL-template-literal'
import cors from 'cors'
import { round, msToS, daysToMs, roundMsToHour } from 'project/frontend/App/functions/time.js'

router.post('/vocabulary/save', cors(), (req, res) => {
  const user_id = 'TEMP'

  const cards = req.body.data

  if (cards.length > 100) {
    return res.status(400).send('Too long')
  }

  const queries = cards.map(card => {
    const due_milliseconds = (new Date()).getTime() + daysToMs(card.due_in_days)

    return sql `
      DELETE FROM vocabulary_schedule
        WHERE card_id = ${card.id}
        AND user_id = ${user_id}
        ;
      INSERT INTO vocabulary_schedule SET
        card_id = ${card.id},
        due = FROM_UNIXTIME(${msToS(roundMsToHour(due_milliseconds))}),
        last_interval_in_days = ${card.due_in_days},
        status = ${card.status||null},
        user_id = ${user_id},
        score = ${card.score},
        times_seen = ${(card.times_seen||0) + 1}
        ;
    `
  })

  query(queries.join(''), (err, results) => {
    if (err) {
      console.error(err)
      res.sendStatus(500)
    } else {
      res.send(results)
    }
  })
})

export default router;
