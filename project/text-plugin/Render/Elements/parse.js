/*
  A poor man's parser that uses HTML data attr tags
  to convert HTML into an object.

  The attribute data-name becomes a key in the object.
*/
export const ParseHTMLtoObject = (children) => {
  let output = {}
  const Traverse = (input) => {
    if (Array.isArray(input)) {
      input.forEach(Traverse)
    } else if (typeof input === 'object' || typeof input === 'function') {
      const name = input.props['data-name']
      const childrenType = input.props['data-children']
      if (childrenType === 'array') {
        output[name] = ParseHTMLtoArray(input.props.children)
      } else if (childrenType === 'object') {
        output[name] = ParseHTMLtoObject(input.props.children)
      } else if (name) {
        output[name] = input.props.children
      } else {
        Traverse(input.props.children)
      }
    }
  }
  Traverse(children)
  return output
}
export const ParseHTMLtoArray = (children) => {
  let output = []
  const Traverse = (input) => {
    if (Array.isArray(input)) {
      input.forEach(Traverse)
    } else if (typeof input === 'object' || typeof input === 'function') {
      const name = input.props['data-name']
      const childrenType = input.props['data-children']
      if (childrenType === 'array') {
        output.push(ParseHTMLtoArray(input.props.children))
      } else if (childrenType === 'object') {
        output.push(ParseHTMLtoObject(input.props.children))
      } else if (name) {
        output.push(input.props.children)
        // output.push({
        //   name,
        //   children: input.props.children,
        // })
      } else {
        Traverse(input.props.children)
      }
    }
  }
  Traverse(children)
  return output
}
