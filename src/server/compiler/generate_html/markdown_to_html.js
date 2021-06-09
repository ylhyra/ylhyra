import typeset from 'typeset'
import { URL_title } from 'compiler/generate_html'
import marked from 'marked'
// import markdown from 'simple-markdown'
let links = require('src/output/links.js')

export default (input) => {
  input = input
    /* Remove nbsp */
    .replace(' ', ' ')
    /* Internal links */
    .replace(/\[\[(.+?)\]\]/g, (x, match) => {
      let [link, target] = match.split('|')
      link = link.trim()
      target = (target || link).trim()
      if (/^:?w:/i.test(link)) {
        link = `http://en.wikipedia.org/wiki/${encodeURIComponent(link.replace(/^w:/i,''))}`
      } else {
        link = URL_title(link)
        if (!(link in links)) {
          return target
        }
        /* TODO - follow redirect */
      }
      return `<a href="${link}">${target}</a>`
    })
    /* External links */
    .replace(/\[(http[^ ]+?) (.+?)\]/g, (x, url, text) => {
      return `<a href="${url}">${text}</a>`
    })
    .replace(/\n\*\*\*\n/g, '\n<hr/>\n')
    /* Lists */
    .replace(/\n(\*+) ?/g, (x, bullets) => {
      return `\n${'  '.repeat(bullets.length-1)}- `
    })
    .replace(/\n(#+) ?/g, (x, bullets) => {
      return `\n${'  '.repeat(bullets.length-1)}1. `
    })
    /* Headings */
    .replace(/\n(=+) ?(.+)(=+)/g, (x, equals, title) => {
      return `\n${'#'.repeat(equals.length)} `
    })
    /* Bold */
    .replace(/'''/g, '**')
    .replace(/''/g, '*')

    .replace(/<a1\/>/g, '<a1></a1>')


  // input = '<div>' +
  //   input.replace(/\n\n/g, '</div><div>') +
  //   '</div>'
  //
  //
  // console.log(input)
  input = marked(input)
  input = typeset(input, { disable: ['hyphenate', 'hangingPunctuation', 'ligatures', 'smallCaps'] })
  return input
}
