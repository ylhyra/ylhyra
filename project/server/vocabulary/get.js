import query from 'server/database'
const router = (require('express')).Router()
import shortid from 'shortid'
import sql from 'server/database/functions/SQL-template-literal'
import cors from 'cors'

router.all('/vocabulary/get',/* cors({ origin: 'https://ylhyra.is', credentials: true }),*/(req, res) => {
  // res.set('referrerPolicy', 'origin') // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url



  if (!req.session.user_id) {
    req.session.user_id = shortid.generate()
  }
  console.log(req.session.user_id)
  query(sql `
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
