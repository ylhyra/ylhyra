import shortid from 'shortid'

export const TempIDs = (input) => {
  if (!input) return input
  const { node, tag, attr, child, text } = input
  const id = (attr && attr.id) || null
  return {
    ...input,
    child: child && child.map(e => TempIDs(e)),
    attr: {
      ...attr,
      id: (id || `temp__${shortid.generate()}`)
    },
  }
}

export const RemoveTempIDs = (input) => {
  if (!input) return input
  const { node, tag, attr, child, text } = input
  let id = (attr && attr.id) || ''
  if (id.match(/^temp__/)) {
    id = null
  }
  return {
    ...input,
    child: child && child.map(e => RemoveTempIDs(e)),
    attr: {
      ...attr,
      id,
    },
  }
}
