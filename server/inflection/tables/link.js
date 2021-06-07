import { getTagInfo } from 'tables/classification/classification'

/*
  Creates a link from our labels to relevant Ylhýra pages
*/
export default (link, label) => {
  if (!link || typeof link !== 'string') return '';
  if (label === undefined) {
    label = link;
  } else if (!label) {
    return '';
  }

  /* Retrieve additional info from "classification.js" file */
  const info = getTagInfo(link, false)
  if (info) {
    if (info.has_article_on_ylhyra) {
      link = info.title
    } else {
      /* Link does not exist */
      return label;
    }
  }

  /* Link does not exist */
  if (missing_links.includes(link)) {
    return label;
  }

  const url = 'https://ylhyra.is/' + encodeURIComponent(ucfirst(link.trim().replace(/( )/g, '_')))
  return `<a class="plainlink" target="_blank" href="${url}">${label}</a>`
}

export const removeLinks = (string) => {
  return string && string
    .replace(/<\/a>/g, '')
    .replace(/<a .+?>/g, '')
}

export const stripHTML = (string) => {
  return string && string
    .replace(/<\/[a-z]+>/g, '')
    .replace(/<[a-z]+ ?([^>]+)?>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export const ucfirst = (input) => (
  input && (input.charAt(0).toUpperCase() + input.slice(1))
)

export const ucfirst_link = (input) => (
  input = input.replace(/^(?:<a .+?>)?(.)/, part => {
    let split = part.split('')
    split[split.length - 1] = ucfirst(split[split.length - 1])
    return split.join('')
  })
)

let missing_links = [
  'irregular inflection',
  'includes a sound change',
  'regular inflection',
  'strongly conjugated',
  'weakly conjugated',
  'helper words for the article',
]
