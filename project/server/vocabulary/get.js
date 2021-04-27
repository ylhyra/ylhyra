import query from 'server/database'
const router = (require('express')).Router()
import shortid from 'shortid'
import sql from 'server/database/functions/SQL-template-literal'

router.post('/get_vocabulary_cards', (req, res) => {
  if(!req.session.user_id) {
    req.session.user_id = shortid.generate()
  }
  query(sql`
    SELECT * FROM vocabulary_cards
    ORDER BY level
    LIMIT 30
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
