import { updateID } from 'User/Parse/Compiler/1_Precompile/UpdateID'

/*
  Step 1:
  Merge phrases into a single word
*/

let translation
let removedIDs

const init = (tree, _translation) => {
  translation = _translation
  removedIDs = []
  return Traverse(tree)
}

const Traverse = (input, siblings = []) => {
  if (!input) return input
  const { node, tag, attr, child, text } = input
  const id = (attr && attr.id) || null
  if (node === 'element' || node === 'root') {
    if (tag === 'word') {
      if (removedIDs.includes(id)) return null
      const definition = translation.definitions[translation.words[id]]
      // console.log(translation.words[id])
      // console.log(translation.definitions['175uoye'])
      // console.log(definition)

      let addSiblings = []
      if (definition && definition.contains.length > 1) {
        addSiblings = readSiblings(siblings, id, definition.contains)
      }
      return {
        ...input,
        attr: {
          ...input.attr,
          definition,
        },
        child: [
          ...(child && child.map(e => Traverse(e, child))) || [],
          ...addSiblings,
        ]
      }
    } else if (tag === 'sentence') {
      return {
        ...input,
        attr: {
          ...input.attr,
          definition: translation.sentences[attr.id],
        },
        child: child && child.map(e => Traverse(e, child))
      }
    } else {
      return {
        ...input,
        child: child && child.map(e => Traverse(e, child))
      }
    }
  } else if (node === 'text') {
    if (removedIDs.includes(id)) return null
    return input
  }
  return input
}

/*
  Loops over next siblings, checks if they belong to the same definition, and merges them
*/
const readSiblings = (siblings, startId, wordGroupContents) => {
  let listening = false
  let returns = []
  /*
    When looping over spaces and punctuation,
    we temporarily store them here until we
    know if they should be added
  */
  let maybeReturn = []
  let maybeRemove = []
  siblings.forEach((element, index) => {
    if (removedIDs.includes(element.attr.id)) return

    if (element.attr.id === startId) {
      listening = true
      // returns = []
    } else if (listening) {
      // console.log(element)
      if (element.tag === 'word') {
        if (wordGroupContents.includes(element.attr.id)) {
          returns = [
            ...returns,
            ...maybeReturn,
            ...element.child,
          ]
          removedIDs.push(element.attr.id)
          removedIDs = removedIDs.concat(maybeRemove)
          maybeReturn = []
          maybeRemove = []

          /*
            Used by Audio Synchronization to update its ids
            (since the merged IDs have been lost)
          */
          updateID(element.attr.id, startId)
        } else {
          listening = false
        }
      } else if (element.node === 'text') {
        maybeReturn.push(element)
        maybeRemove.push(element.attr.id)
      }
    }
  })
  return returns
}

export default init
