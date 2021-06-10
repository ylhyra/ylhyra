/*
node build/ylhyra_server.js --compile-content
*/
// import urlSlug from 'src/User/App/functions/url-slug'
import string_hash from 'User/App/functions/hash'
import { URL_title } from 'documents/Compile/functions'
import { ParseHeaderAndBody } from 'content'
var fs = require('fs');
const content_folder = __basedir + '/../ylhyra_content/'
const output_folder = __basedir + '/src/output/'
const path = require("path");
let files = []
const links = {}

// fs.mkdirSync(output_folder)

const run = () => {
  getFilesRecursively(content_folder)

  for (const file in files) {
    if (typeof files[file] !== 'string') continue;
    const data = fs.readFileSync(files[file], 'utf8')
    let { header, body } = ParseHeaderAndBody(data)
    const filename = FileSafeTitle(header.title) //+ '_' + string_hash(body)
    links[URL_title(header.title)] = {
      title: header.title,
      filename,
      file: files[file],
    }
    header.redirects && header.redirects.forEach(r => {
      if(!r){
        console.log(files[file])
      }
      const [r_title, r_section] = r.split('#')
      if (links[URL_title(r_title)]) return;
      // console.log({r_title})
      links[URL_title(r_title)] = {
        redirect_to: URL_title(header.title),
        section: r_section && URL_title(r_section),
      }
    })
    // // console.log(data)
    // fs.writeFileSync(output_folder + `${filename}.html`, body)
    // break;
  }
  // console.log(done);
  /* Write links */
  fs.writeFileSync(output_folder + 'links.js', `module.exports = ` + JSON.stringify(links, null, 2))
  process.exit()
}


export const FileSafeTitle = (title) => {
  return URL_title(title)
    .replace(/(\/)/g, '_')
    .replace(/(:)/g, '_')
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
