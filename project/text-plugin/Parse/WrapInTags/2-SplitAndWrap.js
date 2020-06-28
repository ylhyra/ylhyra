import { html2json, json2html } from 'text-plugin/App/functions/html2json'

/*
  STEP 2:

  Then we split on the "{{SPLIT HERE}}"
  and then we open and close HTML tags as necessary.
*/

export default function(html, tokenizedSplit, elementName, innerFunction, temp_attribute_name) {
  let count = 0
  let openTags = []
  html = html.split(/{{SPLIT HERE}}/g).map((part, index) => {
    let returns = ''
    /*
      Reopen all open tags since we're starting a new string
    */
    openTags.forEach(e => {
      returns += e
    })

    /*
      Go look for tags
    */
    returns +=
      part.split(/(<[^>]*>)/g).map(b => {
        if (/(<[^>]*>)/g.test(b)) {

          /*
            Tag opens
          */
          if (!b.startsWith('</') && !b.endsWith('/>')) {
            const tagWithId = b
              .replace(/>$/, ` ${temp_attribute_name}="${count++}">`)
            openTags.push(tagWithId)
            return tagWithId
          }
          /*
            Tag closes
          */
          else if (b.startsWith('</')) {
            openTags = openTags.slice(0, openTags.length - 1)
            return b;
          }
        }
        return b
      }).join('')

    /*
      Close all open tags
    */
    openTags.slice().reverse().forEach(e => {
      returns += `</${e.match(/<([^ ]+)/)[1]}>`
    })

    const id = tokenizedSplit[index].id

    /*
      Empty data, punctuation, or empty tags
    */
    // if (!/[A-zÀ-ÿ0-9]/.test(returns.replace(/(<[^>]*>)/g, ''))) {
    //   return returns;
    // }
    if (!id) {
      return returns;
    }

    /*
      Do we send this data deeper?
      [This is done by sentences() to send its children into words()]
    */
    if (innerFunction) {
      returns = json2html(innerFunction(html2json(returns).child, id))
    }

    /*
      Surrounding spaces will not be inside the tag
    */
    if (!returns) { returns = '' }
    const r = returns.match(/^( +)?(.*?)( +)?$/) // Takes the surrounding spaces
    // console.log({returns,r})

    const space_at_beginning = r[1] || ''
    const content = r[2] || ''
    const space_at_end = r[3] || ''

    /*
      Wrap in <sentence/> and <word/> tags
    */
    return space_at_beginning + `<${elementName} id="${id}" data-${elementName}-id="${id}">` + content + `</${elementName}>` + space_at_end
  })
  // console.log('\n\n~~~~~~~~~~~~~~~~~~~~~~~~\n')
  // console.log(html.join(''))
  // let json = html2json(html.join(''))
  return html2json(html.join(''))
}
