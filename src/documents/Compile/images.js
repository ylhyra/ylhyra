import { URL_title } from 'documents/Compile/functions'
import { ParseHeaderAndBody } from 'server/content'
let links = require('src/output/links.js')
require('app/App/functions/array-foreach-async')
var fs = require('fs')
const { exec } = require('child_process');
const output_folder = __basedir + '/src/output/images/'

const Images = (data) => {
  return new Promise(async(resolve, reject) => {
    let input = []
    let output = []
    let r = /<Image (.+)?\/>/g
    /* Collect params */
    data = data.replace(r, params => {
      input.push(params)
      return params
    })
    /* Run */
    await input.forEachAsync(async(z, index) => {
      await new Promise(async(resolve2, reject2) => {
        const filename = z.match(/src="(.+?)"/)[1]
        const file = links[URL_title('File:' + filename)].file.replace(/\.md$/, '')
        const [k, name, ending] = filename.match(/(.+)\.(.+?)$/)

        exec(`identify ${file}`, (error, stdout, stderr) => {
          if (error) return console.error(`exec error: ${error}`);
          const [j, original_width, original_height] = stdout.match(/^[^ ]+ [^ ]+ ([0-9]+)x([0-9]+)/)

          let boxes = [800, 600, 400, 200].map(i => {
            // i = Math.max
            if (original_width > original_height) {
              return [i, Math.round(i * original_height / original_width)]
            } else {
              return [Math.round(i * original_width / original_height), i]
            }
          })

          // const url = `/api/content/files/${encodeURI(file.match(/not_data\/files\/(.+)/)[1])}`
          const url = 'api/images'
          output.push(`<picture>
            ${boxes.map((i,index) => `
              <source
                media="(min-width: ${boxes[index+1]?boxes[index+1][0]:'0'}px)"
                srcset="
                  ${url}?w=${i[0]}&h=${i[1]} 1x,
                  ${url}?w=${i[0]*2}&h=${i[1]*2} 2x"
              />
            `).join('')}
            <img
              src="${url}?w=${boxes[0][0]}&h=${boxes[0][1]}"
              width=${original_width}
              height=${original_height}
            />
          </picture>`.replace(/^ +/mg, '').replace(/\n/g, ' '))




          fs.access(path, fs.F_OK, (err) => {
  if (err) {
    console.error(err)
    return
  }

  //file exists
})

          // exec(
          //   boxes.map(i => `
          //     convert ${file} -resize ${i[0]}x${i[1]} -quality 80 ${output_folder}${name}-${i[0]}x${i[1]}.${ending}
          //   `).join(''), (error2, stdout2, stderr2) => {
          //     if (error2) return console.error(`exec error: ${error2}`);
          //   });
          //
          //
          return resolve2()
        });
      })
    })
    // console.log(output)
    /* Insert */
    let u = 0
    data = data.replace(r, params => {
      // input.push(params)
      // return `<Image src="/api/images/${output[u++]}"/>`
      return output[u++]
    })

    resolve(data)
  })
}

export default Images
