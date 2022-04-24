import React from "react";
import exists from "ylhyra/app/app/functions/exists";
import { WordDefinition } from "ylhyra/documents/types/types";
import { ItalicsAndBold } from "ylhyra/documents/compilation/compileWithTranslation/Compiler/2_CompileToHTML/Definition/functions";

/*
  Maybe TODO:
    Should we attempt to squish InlineTranslation into two lines when applicable?
    That would require finding width of single & double lines and selecting the best.
    Would be cool, but double lines hardly fit between spaces.
*/

export class InlineTranslation extends React.PureComponent<{
  definition: WordDefinition | undefined;
}> {
  render() {
    const { definition } = this.props;
    if (!exists(definition) || !definition!.show_definition_above) {
      return null;
    }
    const text = definition!.inline_translation || definition!.meaning;
    return (
      <>
        {/** These hidden parentheses are only here to make the HTML
             be at least legible when the CSS file is missing.
             This is probably not necessary. */}
        <span className="hidden"> (</span>
        <span className="inline_translation" data-not-text="true" lang="en">
          <span dangerouslySetInnerHTML={{ __html: ItalicsAndBold(text) }} />
        </span>
        <span className="hidden">)</span>
      </>
    );
  }
}
