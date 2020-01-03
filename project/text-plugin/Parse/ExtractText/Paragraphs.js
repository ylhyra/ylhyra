/*
  ____                                       _
 |  _ \ __ _ _ __ __ _  __ _ _ __ __ _ _ __ | |__  ___
 | |_) / _` | '__/ _` |/ _` | '__/ _` | '_ \| '_ \/ __|
 |  __/ (_| | | | (_| | (_| | | | (_| | |_) | | | \__ \
 |_|   \__,_|_|  \__,_|\__, |_|  \__,_| .__/|_| |_|___/
                       |___/          |_|

- Groups paragraphs together
- Then sends these grouped paragraphs to the inputted "paragraphFunction".
- Returns a JSON tree of the entire document.

*/
require('array-sugar')
let documents = []

/*
  - Finds paragraphs of text.
  - Groups sequences of text and inline elements together.
  - This allows us to split sentences without giving a thought about how HTML tags affect it.
  - Block elements make us switch to a new paragraph.
*/
const GroupParagraphs = ({ input, paragraphFunction, isTranslating, getNewTitle }) => {
  if (!input || shouldSkip(input)) return input
  if (input.child) {
    /*
      Look for inline elements & text.
      We group together inline elements before splitting into
      sentences so that "Blah <i>blah</i> blah." will be assesed together.
    */
    let returns = []
    let group = []
    for (let i = 0; i < input.child.length; i++) {
      let isNewDocument = false

      const element = input.child[i]
      if (shouldSkip(element)) {
        returns.push(element)
        continue;
      }
      const shouldTranslate = shouldTranslate_(element, isTranslating)

      if (element.attr) {
        if (element.attr['data-document-start']) {
          // console.error('HAHHAAHA'+element.attr['data-document-start'])
          documents.push(getNewTitle.get(element.attr['data-document-start']))
          isNewDocument = true
        } else if (element.attr['data-document-end'] && documents.length > 0) {
          documents.pop()
          isNewDocument = true
        }
      }

      /*
        If we see an inline element or text, we group
        it together before sending to sentence()
      */
      console.log({isTranslating, shouldTranslate, element})
      if (/*isTranslating === shouldTranslate &&*/ isTranslating && shouldTranslate && (isInlineElement(element.tag) || element.node === 'text') && !isNewDocument) {
        group.push(element)
      }
      /*
        Else, our grouping is finished
      */
      else {
        // console.log(documents.last)
        returns = [
          ...returns,
          ...isTranslating ? (paragraphFunction(group, documents.last) || []) : group,
          GroupParagraphs({ input: element, paragraphFunction, isTranslating: shouldTranslate, getNewTitle }) || {},
        ]
        group = []
      }
    }
    return {
      ...input,
      child: [
        ...returns,
        ...isTranslating ? (paragraphFunction(group, documents.last) || []) : group,
      ]
    }
  }
  return input
}


export const shouldTranslate_ = ({ tag, attr }, isTranslating) => {
  if (tag === 'translate' /*|| tag === 'blockquote'*/ || tag === 'isl' || tag === 'listen' || tag === 'is') {
    return true
  }
  if (attr && (attr['data-translate'] === 'no' || attr['data-translate'] === 'false')) {
    return false
  }
  if (attr && (attr['data-children'] === 'string')) {
    return false
  }
  if (attr && ('data-translate' in attr)) {
    return true
  }

  // if (attr && attr.class === 'reference') {
  //   return false
  // }

  if (attr && attr.class === 'icelandic') {
    return true
  }
  if (attr && ('no-translate' in attr || 'ignore' in attr)) {
    return false
  }
  if(tag === 'sup') {
    return false
  }
  return isTranslating
}


export const isInlineElement = (tag) => {
  if (!tag || typeof tag !== 'string') {
    return false
  }
  return ['span', 'b', 'big', 'i', 'small', 'tt', 'abbr', 'acronym', 'cite', 'code', 'dfn', 'em', 'kbd', 'strong', 'samp', 'var', 'a', 'bdo', 'br', 'map', 'object', 'q', 'sub', 'sup', ]
    .includes(tag.toLowerCase())
}

export const shouldSkip = ({ tag, attr }) => {
  if (!tag || typeof tag !== 'string') {
    return false
  }
  if ((attr && attr.class === 'instructions') || tag === 'answers') {
    return true
  }
  return ['script', 'style', 'head',/* 'sup'*/]
    .includes(tag.toLowerCase())
}

export default GroupParagraphs
