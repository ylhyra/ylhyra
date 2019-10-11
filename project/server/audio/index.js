import Pronunciation from 'datasets/pronunciation'
import Sound from 'datasets/sounds'
const router = (require('express')).Router()

/*
  Finds PRONUNCIATION and SOUND
*/
router.post('/audio/pronunciation_and_sound', async (req, res) => {
  const { missingPronunciation, missingSound } = req.body

  let pronunciation = {}
  // await Promise.all(missingPronunciation.map(text => (
  //   new Promise(async resolve => {
  //     pronunciation[text] = await Pronunciation(text)
  //     resolve()
  //   })
  // )))

  let sound = {}
  await Promise.all(missingSound.map(text => (
    new Promise(async resolve => {
      sound[text] = await Sound(text)
      resolve()
    })
  )))

  res.send({ pronunciation, sound })
})

export default router
