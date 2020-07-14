import React from 'react'
import Tooltip from './Definition/Tooltip'
import InlineTranslation from './Definition/InlineTranslation'
import exists from 'App/functions/exists'
import Box from './Definition/Box/Word'
import { getUpdatedID, getPreviousID } from 'Parse/Compiler/1_Precompile/UpdateID'
import _ from 'underscore'
import GetSound from 'Parse/Compiler/2_CompileToHTML/Sound'
import omitEmpty from 'omit-empty'

class WordElement extends React.Component {
  render() {
    const { id, definition, appendText, editor } = this.props
    const hasTooltip = exists(definition)
    let classes = []
    let attrs = {}
    if (exists(definition)) {

      attrs = omitEmpty({
        'data-word-has-definition': true,
        'data-sound': GetSound(id, editor),
        'data-analysis': get_analysis(id, editor), // Temporarily just BIN id
      })

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

    } else {
      classes.push('missing')
    }

    // console.log(definition)

    return [
      <Box      id={id}  definition={definition} key={1} hidden={true}/>,
      <Tooltip  id={id}  definition={definition} key={2} hidden={true}/>,
      <span className={`word-container ${classes.join(' ')}`} key={3}>
        <InlineTranslation definition={definition}/>
        <span className="word" {...attrs} id={id} data-will-have-audio="true">
          {this.props.children}
        </span>
        {appendText}
      </span>,
    ]
  }
}

const get_analysis = (updatedID, editor) => {
  const id = getPreviousID(updatedID) || updatedID
  return editor.analysis[id]?.BIN_id || null
}

export default WordElement
