import React from 'react'
import Box from './Definition/Box/Sentence'
import exists from 'App/functions/exists'

class Sentence extends React.Component {
  render() {
    const { selected } = this.props
    const { id, definition } = this.props
    let attrs = {}
    let classes = []
    if (exists(definition) && definition.meaning.trim())  {
      /*
        All sentences have "id" but only sentences
        with a definition get "data-sentence-id"
      */
      attrs = {
        'data-sentence-id': id,
      }
    } else {
      classes.push('missing')
    }
    // console.log(this.props.children)
    return [
      <Box id={id} definition={definition} sentence/>,
      <span className={`sentence ${classes.join(' ')}`} {...attrs} id={id} data-type="sentence">
        {this.props.children}
      </span>,
    ]
  }
}

export default Sentence
