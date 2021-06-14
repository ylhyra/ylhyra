import { URL_title } from 'documents/Compile/functions'
import { ParseHeaderAndBody } from 'server/content'
let links = require('src/output/links.js')
require('app/App/functions/array-foreach-async')
var fs = require('fs')

const Transclude = (title, depth = 0) => {
  return new Promise((resolve, reject) => {
    let url = URL_title('Template:' + title)
    if (!(url in links)) {
      url = URL_title(title)
      if (!(url in links)) {
        return resolve(`\nNo template named "${title}"\n`)
      }
    }

    fs.readFile(links[url].file, 'utf8', async(err, data) => {
      if (err) {
        console.log(err)
        return resolve(`\nFailed to read file for ${title}\n`)
      }
      let { header, body } = ParseHeaderAndBody(data)

      let output = body
      /* Strip comments */
      output = output.replace(/<!--(.+?)-->/g, '')
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
              const j = (await Transclude(q, depth + 1)).output
              // console.log(j)
              output += j
              return resolve2()
            })
          })
      }

      resolve({ output, header })
    })
  })
}

export default Transclude
