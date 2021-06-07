import React from 'react'
import exists from 'User/App/functions/exists'
import { ItalicsAndBold } from 'Parse/Compiler/2_CompileToHTML/Definition/Tooltip'

/*
  Maybe TODO:
    Should we attempt to squish InlineTranslation into two lines when applicable?
    That would require finding width of single & double lines and selecting the best.
    Would be cool, but double lines hardly fit between spaces.
*/

class InlineTranslation extends React.PureComponent {
  render() {
    const { definition } = this.props
    if (!exists(definition) || !definition.show_definition_above) {
      return null;
    }
    const text = definition.inline_translation || definition.meaning
    return (
      <sup className="inline_translation" data-not-text="true" hidden={true}>
        <span dangerouslySetInnerHTML={{__html: ItalicsAndBold(text)}}/>
      </sup>
    )
  }
}

export default InlineTranslation
