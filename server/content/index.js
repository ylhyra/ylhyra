// import links from './../../output/links'
const router = (require('express')).Router()
var fs = require('fs')
const folder = __dirname + '/../../output/'

let links = {}

router.get('/content/:title', async(req, res) => {
  // TODO!!
  links = fs.readFileSync(folder + 'links.js', 'utf8')

  const title = req.params.title

  if (links[title]) {
    const filename = links[title].filename
    const content = await fs.readFile(folder + filename + '.html', 'utf8')
  } else {
    return res.sendStatus(404)
  }
})

export default router;
