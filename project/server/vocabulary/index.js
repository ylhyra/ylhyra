import query from 'server/database'
const router = (require('express')).Router()
import shortid from 'shortid'
import sql from 'server/database/functions/SQL-template-literal'

router.get('/vocabulary', (req, res) => {
  if(!req.session.user_id) {
    req.session.user_id = shortid.generate()
  }
  console.log(req.session.user_id)
  res.sendStatus(200)
  // query(sql`
  //   SELECT
  //     page_name,
  //     SUM(total_views) as total_views,
  //     COUNT(user_session) AS unique_views
  //   FROM interactions AS table1
  //   JOIN  (
	//     SELECT
	//       id,
	//       COUNT(user_session) AS total_views
	//     FROM interactions
	//     WHERE type = "view"
	//     GROUP BY user_session
  //   ) AS table2
  //   ON table1.id = table2.id
  //   WHERE type = "view"
  //   GROUP BY page_name
  //   ORDER BY unique_views DESC
  //   LIMIT 20;
  // `, (err, results) => {
  //   if (err) {
  //     console.error(err)
  //     res.sendStatus(500)
  //   } else {
  //     res.send(results)
  //   }
  // })
})

export default router;
