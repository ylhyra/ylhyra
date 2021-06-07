import express from 'express'
const app = express()
const port = 4545
import path from 'path'
import routes from './route_loader'

app.use('/inflection_styles', express.static(path.join(__dirname, '/../../styles')))
app.use('/', require(path.join(__dirname, './route_loader')).default)

app.listen(port, null, (err) => {
  if (err) {
    console.log(err.message)
  }
})
