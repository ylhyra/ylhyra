import Sound from 'datasets/sounds'
const router = (require('express')).Router()

/*
  Returns audio file for a single input
*/
router.get('/GetOneAudioFile', async (req, res) => {
  const { text } = req.query
  const file = await Sound(text)
  res.send({ file })
})
export default router
