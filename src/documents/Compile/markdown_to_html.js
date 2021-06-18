import typeset from 'typeset'
import { URL_title, section_id } from 'paths.js'
import marked from 'marked'
import RemoveUnwantedCharacters from 'app/App/functions/RemoveUnwantedCharacters'
import { html2json, json2html } from 'app/App/functions/html2json'
// import markdown from 'simple-markdown'

let links = require('src/output/links.js')

export default (input) => {

  // console.log(input)
  let json = html2json(input)
  // console.log(json)
  json = Traverse(json)
  // console.log(JSON.stringify(json, null, 2))
  // console.log(json2html(json))

  return json2html(json)
}

const Traverse = (json) => {
  if (!json) return null
  const { node, tag, attr, child, text } = json
  if (node === 'element' || node === 'root') {
    return {
      ...json,
      child: child && child.map((e, i) => Traverse(e))
    }
  } else if (node === 'text') {
    /* TODO Needs to be parsed with siblings */
    return {
      ...json,
      text: process_(text)
    }
  }
}

const process_ = (input) => {

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

        if (!(link in links)) {
          return target
        }
        if (links[link].redirect_to) {
          link = links[link].redirect_to + '#' + links[link].section
        }
        link = '/' + link
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
    // .replace(/^(#+) ?/gm, (x, bullets) => {
    //   return `${'  '.repeat(bullets.length-1)}1. `
    // })
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

  // console.log(input)

  input = marked(input)

  // console.log(input)

  input = input
    .replace(/(<h[0-9] id=")/g, '$1s-')
  // console.log(input.slice(0,200))

  input = typeset(input, { disable: ['hyphenate', 'hangingPunctuation', 'ligatures', 'smallCaps'] })
  // console.log(input)
  return input
}
