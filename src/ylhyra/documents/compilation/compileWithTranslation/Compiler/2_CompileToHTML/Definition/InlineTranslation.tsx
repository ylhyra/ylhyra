import React from "react";
import exists from "ylhyra/app/app/functions/exists";
import { ItalicsAndBold } from "ylhyra/documents/compilation/compileWithTranslation/Compiler/2_CompileToHTML/Definition/Tooltip";
import { WordDefinition } from "ylhyra/documents/compilation/compileWithTranslation/types";

/*
  Maybe TODO:
    Should we attempt to squish InlineTranslation into two lines when applicable?
    That would require finding width of single & double lines and selecting the best.
    Would be cool, but double lines hardly fit between spaces.
*/

class InlineTranslation extends React.PureComponent<{
  definition: WordDefinition;
}> {
  render() {
    const { definition } = this.props;
    if (!exists(definition) || !definition.show_definition_above) {
      return null;
    }
    const text = definition.inline_translation || definition.meaning;
    return [
      <span className="hidden" key={1}>
        {" "}
        (
      </span>,
      <span
        className="inline_translation"
        data-not-text="true"
        // hidden={true}
        lang="en"
        key={2}
      >
        <span dangerouslySetInnerHTML={{ __html: ItalicsAndBold(text) }} />
      </span>,
      <span className="hidden" key={3}>
        )
      </span>,
    ];
  }
}

export default InlineTranslation;
