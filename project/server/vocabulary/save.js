/**
 * Saves session and updates schedule
 */
import query from 'server/database'
const router = (require('express')).Router()
import shortid from 'shortid'
import sql from 'server/database/functions/SQL-template-literal'
import cors from 'cors'

router.post('/vocabulary/save', cors(), (req, res) => {
  if (!req.session.user_id) {
    // return res.status(400).send('No user')
  }
  const cards = req.body.data

  if (cards.length > 100) {
    return res.status(400).send('Too long')
  }

  const queries = cards.map(i => {
    return sql `
      DELETE FROM vocabulary_schedule
        WHERE card_id = ${i.id}
        AND user_id = ${req.session.user_id}
        ;
      INSERT INTO vocabulary_schedule SET
        card_id = ${i.id},
        due_date = '1234',
        status = 'learning',
        user_id = ${req.session.user_id}
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
