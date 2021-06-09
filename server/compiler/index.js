/*
node server/compiler/index.js
*/
// import urlSlug from 'src/User/App/functions/url-slug'
import string_hash from 'User/App/functions/hash'
var fs = require('fs');
const content_folder = './../ylhyra_content/'
const output_folder = './output/'
const path = require("path");
let files = []
const links = {}
// fs.mkdirSync(output/')

const run = () => {
  getFilesRecursively(content_folder)

  for (const file in files) {
    const data = fs.readFileSync(files[file], 'utf8')
    let [header, body] = data.split(/\n---\n/)
    header = ParseHeader(header)
    const filename = FileSafeTitle(header.title) //+ '_' + string_hash(body)
    links[header.title] = { filename }
    // console.log(data)
    fs.writeFileSync(output_folder + `${filename}.html`, body)
    break;
  }
  /* Write links */
  fs.writeFileSync(output_folder + 'links.js', `export default ` + JSON.stringify(links, null, 2))
  process.exit()
}

const ParseHeader = (header) => {
  let output = {}
  header.split('\n').forEach(i => {
    const [key, val] = i.split(/ = /)
    if (key) {
      output[key] = val
    }
  })
  return output
}

export const FileSafeTitle = (title) => {
  return title.replace(/(\/)/g, '_').replace(/( )/g, '_')
}

// https://stackoverflow.com/a/66187152 CC BY-SA 4.0
const getFilesRecursively = (directory) => {
  const filesInDirectory = fs.readdirSync(directory);
  for (const file of filesInDirectory) {
    if (file.startsWith('.')) continue;
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      getFilesRecursively(absolute);
    } else {
      if (!file.endsWith('.md')) continue;
      files.push(absolute);
    }
  }
};
run()
