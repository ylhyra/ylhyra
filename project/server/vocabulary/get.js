import query from 'server/database'
const router = (require('express')).Router()
import shortid from 'shortid'
import sql from 'server/database/functions/SQL-template-literal'

router.post('/vocabulary/get', (req, res) => {
  if(!req.session.user_id) {
    req.session.user_id = shortid.generate()
  }
  query(sql`
    SELECT * FROM vocabulary_cards
    ORDER BY level
    LIMIT 1
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
