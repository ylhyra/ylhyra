import React from 'react'
import Tooltip from './Definition/Tooltip'
import InlineTranslation from './Definition/InlineTranslation'
import exists from 'App/functions/exists'
import Box from './Definition/Box/Word'
import { getUpdatedID } from 'Parse/Compiler/1_Precompile/UpdateID'
import _ from 'underscore'
import GetSound from 'Parse/Compiler/2_CompileToHTML/Sound'

class WordElement extends React.Component {
  render() {
    const { id, definition, audio, appendText } = this.props
    const hasTooltip = exists(definition)
    let attrs = {}
    let classes = []
    if (exists(definition)) {

      /*
        All words have "id" but only words with a
        definition get "data-sentence-id"
      */
      attrs = {
        'data-word-id': id,
        'data-sound': GetSound(id),
      }

      /*
        .difficult
        .has-inline-translation
      */
      classes = [
        definition.difficult ? 'difficult' : null,
        definition.show_definition_above ? 'has-inline-translation' : null,
      ]

      /*
        [data-connected-words]
      */
      if (definition.contains.length > 1) {
        attrs['data-connected-words'] = _.uniq(definition.contains
          .map(id => getUpdatedID(id)))
          .filter(i => i !== id)
          .join(',')
      }

    }

    // console.log(definition)

    return [
      <Box      id={id}  definition={definition}/>,
      <Tooltip  id={id}  definition={definition}/>,
      <span className={`word-container ${classes.join(' ')}`}>
        <InlineTranslation definition={definition}/>
        <span className="word" {...attrs} id={id}>
          {this.props.children}
        </span>
        {appendText}
      </span>,
    ]
  }
}

export default WordElement
