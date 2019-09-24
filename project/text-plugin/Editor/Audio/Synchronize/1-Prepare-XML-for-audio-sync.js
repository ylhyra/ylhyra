import store from 'App/store'

const AudioXML = (sectionHash) => {
  const { editor } = store.getState()
  const section = editor.audio.sections.find(section => section.hash === sectionHash)
  if (!section) return null
  let xml = ''
  section.coversParagraphs.forEach(paragraphHashOfIds => {
    editor.tokenized.find(paragraph => paragraph.hashOfIds === paragraphHashOfIds).sentences.forEach(sentence => {
      xml += `
        <div id="${sentence.id}">${sentence.words.map(word => {
          if(typeof word === 'string') return word;
          return `<span id="${word.id}">${word.text}</span>`
        }).join('')}</div>
      `
    })
  })
  // console.log(xml)
  return xml
}
export default AudioXML



// /*
//   Prepare an XML file for audio synchronization.
//   Only leaves id tags on sentences and words.
// */
// const AudioXML = (input, index = 0) => {
//   if (!input) return null
//   const { node, tag, attr, child, text } = input
//   if (node === 'element' || node === 'root') {
//     if (attr.hasOwnProperty('no-audio')) return null;
//     if (includesAny(skipTags, tag)) return null;
//     // if (attr && includesAny(skipClasses, attr.class)) return null;
//
//     let attrs = {}
//     let Tag = tag || 'span'
//     if (tag === 'sentence' || tag === 'word') {
//       Tag = 'span'
//       attrs = {
//         id: (attr && attr.id),
//       }
//     }
//     if (tag === 'root') {
//       return child.map((e, i) => AudioXML(e, i))
//     }
//     return (
//       <Tag {...attrs} key={index}>
//         {child && child.map((e,i) => AudioXML(e,i))}
//       </Tag>
//     )
//   } else if (node === 'text') {
//     return text
//   }
// }
// export default AudioXML
//
//
// // const skipClasses = [
// //   'no-audio',
// // ]
// const skipTags = [
//   'no-audio',
//   'answers',
// ]

export const includesAny = (haystack, arr) => {
  if (!arr) return false;
  if (typeof arr === 'string') {
    arr = [arr]
  }
  return arr.some((v) => {
    return haystack.indexOf(v) >= 0;
  })
}
