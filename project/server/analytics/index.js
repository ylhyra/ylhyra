import query from 'server/database'
const router = (require('express')).Router()
import shortid from 'shortid'
// var cors = require('cors')
// app.use(cors({
//   origin: 'https://ylhyra.is',
// }))
// app.options('/products/:id', cors()) // enable pre-flight request for DELETE request

router.post('/a', (req, res) => {
  if(!req.session.user_id) {
    req.session.user_id = shortid.generate()
  }
  /*
    Text interactions
  */
  if(req.body.seen) {
    req.body.seen.forEach(item => {
      query(`INSERT INTO interactions SET
        user_session = ?,
        page_name = ?,
        item_id = ?,
        item_seen_at = FROM_UNIXTIME(?),
        item_time_seen = ?,
        type = "text"
        `, [
          req.session.user_id,
          req.body.pageName,
          item.id,
          Math.round(item.seenAt/1000), // To UNIX time
          item.timeSeen,
      ], (err, results) => {
        if (err) {
          console.error(err)
        } else {
        }
      })
    })
  }
  /*
    Page views
  */
  else {
    query(`INSERT INTO interactions SET
      ip = ?,
      browser = ?,
      version = ?,
      os = ?,
      platform = ?,
      is_mobile = ?,
      user_session = ?,
      page_name = ?,
      type = "view"
      `, [
        req.clientIp,
        req.useragent.browser,
        req.useragent.version.split('.')[0],
        req.useragent.os,
        req.useragent.platform,
        req.useragent.isMobile,
        req.session.user_id,
        req.body.pageName,
    ], (err, results) => {
      if (err) {
        console.error(err)
      } else {
      }
    })
  }
  res.sendStatus(200)
})

/*
  List most popular pages by unique visitors
*/
router.get('/a', (req, res) => {
  query(`
    SELECT
      page_name,
      SUM(total_views) as total_views,
      COUNT(user_session) AS unique_views
    FROM interactions AS table1
    JOIN  (
	    SELECT
	      id,
	      COUNT(user_session) AS total_views
	    FROM interactions
	    WHERE type = "view"
	    GROUP BY user_session
    ) AS table2
    ON table1.id = table2.id
    WHERE type = "view"
    GROUP BY page_name;
  `, [], (err, results) => {
    if (err) {
      console.error(err)
      res.sendStatus(500)
    } else {
      res.send(results)
    }
  })
})


export default router;
