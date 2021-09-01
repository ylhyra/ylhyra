import React from "react";
import exists from "app/app/functions/exists";
import { ItalicsAndBold } from "documents/parse/Compiler/2_CompileToHTML/Definition/Tooltip";

/*
  Maybe TODO:
    Should we attempt to squish InlineTranslation into two lines when applicable?
    That would require finding width of single & double lines and selecting the best.
    Would be cool, but double lines hardly fit between spaces.
*/

class InlineTranslation extends React.PureComponent {
  render() {
    const { definition } = this.props;
    if (!exists(definition) || !definition.show_definition_above) {
      return null;
    }
    const text = definition.inline_translation || definition.meaning;
    return [
      <rp key={1}> (</rp>,
      <rt
        className="inline_translation"
        data-not-text="true"
        // hidden={true}
        lang="en"
        key={2}
      >
        <span dangerouslySetInnerHTML={{ __html: ItalicsAndBold(text) }} />
      </rt>,
      <rp key={3}>)</rp>,
    ];
  }
}

export default InlineTranslation;
