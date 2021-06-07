import query from /*'server/*/ 'database'
const router = (require('express')).Router()
import shortid from 'shortid'
import sql from /*'server/*/ 'database/functions/SQL-template-literal'
import cors from 'cors'

/**
 * User is not kept in a session due to cross-origin problems
 */

router.all('/vocabulary/get', /* cors({ origin: 'https://ylhyra.is', credentials: true }),*/ (req, res) => {
  /* Temp */
  // let user_id = req.body.user_id || shortid.generate()
  // res.setHeader('user_id', user_id) /* Temp */

  query(sql `
    SELECT * FROM vocabulary_cards
    ORDER BY level, sort
    LIMIT 200
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
