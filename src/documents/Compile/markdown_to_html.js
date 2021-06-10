import typeset from 'typeset'
import { URL_title } from 'documents/Compile/functions'
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
    .replace(/\[((?:http|mailto)[^ ]+?) (.+?)\]/g, (x, url, text) => {
      return `<a href="${url}">${text}</a>`
    })
    .replace(/\[((?:http|mailto)[^ ]+?)\]/g, (x, url) => {
      return `[<a href="${url}">link</a>]`
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
    .replace(/\n(=+) ?(.+)\1/g, (x, equals, title) => {
      return `\n${'#'.repeat(equals.length)} ${title}`
    })
    /* Bold */
    .replace(/'''/g, '**')
    .replace(/''/g, '*')

    /* Tags */
    .replace(/<([^>]+)\/>/g, '<$1></$1>')

  /* References */
  // input = input.split(/<ref[> ][\s\S]+<\/ref>/g)


  input = marked(input)
  input = typeset(input, { disable: ['hyphenate', 'hangingPunctuation', 'ligatures', 'smallCaps'] })
  return input
}
