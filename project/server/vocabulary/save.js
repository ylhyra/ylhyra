/**
 * Saves session and updates schedule
 */
import query from 'server/database'
const router = (require('express')).Router()
import shortid from 'shortid'
import sql from 'server/database/functions/SQL-template-literal'

router.post('/vocabulary/save', (req, res) => {
  if (!req.session.user_id) {
    // return res.status(400).send('No user')
  }
  console.log(req.body.data)
  res.send(200)
  return
  
  query(sql `
    INSERT INTO vocabulary_schedule
      card_id VARCHAR(20),
      due BIGINT,
      score VARCHAR(20),
      last_seen BIGINT,
      user_id VARCHAR(32)
   `, (err, results) => {
    if (err) {
      console.error(err)
      res.sendStatus(500)
    } else {
      res.send(results)
    }
  })
})

export default router;
