import React from "react";
import exists from "ylhyra/app/app/functions/exists";
import { WordDefinition } from "ylhyra/documents/types/types";
import { ItalicsAndBold } from "ylhyra/documents/compilation/compileWithTranslation/Compiler/2_CompileToHTML/Definition/functions";

export class Tooltip extends React.PureComponent<{
  definition: WordDefinition | undefined;
  id: string;
  hidden?: Boolean;
}> {
  render() {
    const { definition, id } = this.props;
    if (!exists(definition) || !definition!.meaning) {
      return null;
    }
    return (
      <small
        className="tooltip"
        data-not-text="true"
        id={`${id}-tooltip`}
        hidden={true}
      >
        {definition!.meaning && (
          <span className="meaning">
            <span
              dangerouslySetInnerHTML={{
                __html: ItalicsAndBold(definition!.meaning),
              }}
            />
          </span>
        )}
      </small>
    );
  }
}
