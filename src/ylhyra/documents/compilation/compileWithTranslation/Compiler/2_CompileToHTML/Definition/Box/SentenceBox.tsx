import exists from "modules/exists";
import React from "react";
import { ItalicsAndBold } from "ylhyra/documents/compilation/compileWithTranslation/Compiler/2_CompileToHTML/Definition/functions";
import { SentenceDefinition } from "ylhyra/documents/types/types";

/**
 * Box with extra information shown at the bottom of the screen
 */
export class SentenceBox extends React.PureComponent<{
  definition: SentenceDefinition | undefined;
  id: string;
}> {
  render() {
    const { definition } = this.props;
    if (
      !exists(definition) ||
      !(definition.meaning || definition.direct || definition.note)
    ) {
      return null;
    }
    return (
      <>
        <span
          className="box"
          id={`${this.props.id}-box`}
          data-ignore="true"
          data-not-text="true"
          hidden={true}
          lang="en"
        >
          {definition.meaning && (
            <span className="meaning">
              <span
                dangerouslySetInnerHTML={{
                  __html: ItalicsAndBold(definition.meaning),
                }}
              />
            </span>
          )}
          {definition.direct && (
            <span className="direct">
              {/* <label>Literally</label> */}
              “
              <span
                dangerouslySetInnerHTML={{
                  __html: ItalicsAndBold(definition.direct),
                }}
              />
              ”
            </span>
          )}
          {definition.note && (
            <span className="note small">
              <label>Note</label>
              <span
                dangerouslySetInnerHTML={{
                  __html: ItalicsAndBold(definition.note),
                }}
              />
            </span>
          )}
        </span>
        <span
          className="sentence-overlay"
          id={`${this.props.id}-sentence-overlay`}
          data-ignore="true"
        />
      </>
    );
  }
}
