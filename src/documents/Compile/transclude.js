import { URL_title } from 'documents/Compile/functions'
import { ParseHeaderAndBody } from 'content'
let links = require('src/output/links.js')
require('User/App/functions/array-foreach-async')
var fs = require('fs')

const Transclude = (title, depth = 0) => {
  return new Promise((resolve, reject) => {
    title = URL_title(title)
    if (!(title in links)) {
      return resolve(`\nNo template ${title}\n`)
    }

    fs.readFile(links[title].file, 'utf8', async(err, data) => {
      if (err) {
        console.log(err)
        return resolve(`\nFailed to read file for ${title}\n`)
      }
      let { header, body } = ParseHeaderAndBody(data)

      let output = body
      // TODO
      if (depth < 1) {
        output = ''
        await body.split(/{{([^{}]+)}}/g)
          .forEachAsync(async(q, index) => {
            await new Promise(async(resolve2, reject2) => {
              if (index % 2 === 0) {
                output += q
                return resolve2()
              }
              const j = await Transclude('Template:' + q, depth + 1)
              // console.log(j)
              output += j
              return resolve2()
            })
          })

      }

      resolve(output)
    })
  })
}

export default Transclude
