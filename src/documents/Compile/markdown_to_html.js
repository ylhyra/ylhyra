import typeset from 'typeset'
import { URL_title, section_id } from 'documents/Compile/functions'
import marked from 'marked'
import RemoveUnwantedCharacters from 'app/App/functions/RemoveUnwantedCharacters'
// import markdown from 'simple-markdown'
let links = require('src/output/links.js')

export default (input) => {
  input = RemoveUnwantedCharacters(input)
    /* Internal links */
    .replace(/\[\[(.+?)\]\]/g, (x, match) => {
      let [link, target] = match.split('|')
      link = link.trim()
      target = (target || link).trim()
      if (/^:?w:/i.test(link)) {
        link = `http://en.wikipedia.org/wiki/${encodeURIComponent(link.replace(/^w:/i,''))}`
      } else {
        link = URL_title(link)
        // console.log(link)
        if (!(link in links)) {
          return target
        }
        if (links[link].redirect_to) {
          link = links[link].redirect_to + '#' + links[link].section
        }
        link = '/' + link
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
    .replace(/^\*\*\*\n/gm, '\n<hr/>\n')
    /* Lists */
    .replace(/^(\*+) ?/gm, (x, bullets) => {
      return `${'  '.repeat(bullets.length-1)}- `
    })
    .replace(/^(#+) ?/gm, (x, bullets) => {
      return `${'  '.repeat(bullets.length-1)}1. `
    })
    /* Headings */
    .replace(/^(=+) ?(.+)\1/gm, (x, equals, title) => {
      return `${'#'.repeat(equals.length)} ${title}`
      // return `<h${equals.length} id="${section_id(title)}">${title}</h${equals.length}>`
    })
    /* Bold */
    .replace(/'''/g, '**')
    .replace(/''/g, '*')

    /* Tags */
    .replace(/<([^> ]+)( [^>]+)?\/>/g, '<$1$2></$1>')

    // /* Remove? */
    // .replace(/<\/Image>\n\n/g, '</Image>\n')

  /* References */
  // input = input.split(/<ref[> ][\s\S]+<\/ref>/g)

  // console.log(input.slice(0, 200))

  console.log(input)


  console.log(input)
  input = marked(input)

  input = input
    .replace(/(<h[0-9] id=")/g, '$1s-')
  // console.log(input.slice(0,200))

  input = typeset(input, { disable: ['hyphenate', 'hangingPunctuation', 'ligatures', 'smallCaps'] })
  // console.log(input)
  return input
}
