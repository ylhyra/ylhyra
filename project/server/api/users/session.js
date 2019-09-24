//
// router.post('/user/session', (req, res) => {
//   res.cookie('egill', 'flottur')
//   res.send({})
//   return
//
//   // console.log(req.session.id)
//   if (req.session.user) {
//     res.send({
//       user: req.session.user
//     })
//   } else if (req.session.saved) {
//     res.send({
//       user: null,
//       started: req.session.started,
//     })
//   } else {
//     var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
//     query(`INSERT INTO user_sessions SET
//       session_id = ?,
//       ip = ?,
//       user_agent = ?,
//       timezone = ?,
//       display = ?,
//       accept_language = ?;`, [
//       req.session.id,
//       ip,
//       req.headers['user-agent'],
//       req.body.timezone,
//       JSON.stringify({
//         display: req.body.display,
//         window: req.body.window,
//       }),
//       req.headers['accept-language']
//     ], (err, results) => {
//       req.session.user_id = req.session.id
//       if (err) {
//         res.send(err) // TODO
//         req.session.destroy(() => {
//           res.send(err) // TODO
//         })
//       } else {
//         req.session.saved = true
//         res.send('ok :)')
//       }
//     })
//   }
// })
