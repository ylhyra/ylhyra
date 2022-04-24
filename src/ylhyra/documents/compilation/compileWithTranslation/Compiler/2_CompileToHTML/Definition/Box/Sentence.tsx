import React from "react";
import exists from "ylhyra/app/app/functions/exists";
import { ItalicsAndBold } from "ylhyra/documents/compilation/compileWithTranslation/Compiler/2_CompileToHTML/Definition/Tooltip";
import { SentenceDefinition } from "ylhyra/documents/types/types";

export default class SentenceBox extends React.PureComponent<{
  definition: SentenceDefinition;
  id: string;
  // hidden?: boolean;
}> {
  render() {
    const { definition } = this.props;
    if (
      !exists(definition) ||
      !(definition.meaning || definition.direct || definition.note)
    )
      return null;
    return [
      <span
        className="box"
        id={`${this.props.id}-box`}
        data-ignore="true"
        data-not-text="true"
        key={1}
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
      </span>,
      <span
        className="sentence-overlay"
        id={`${this.props.id}-sentence-overlay`}
        data-ignore="true"
        key={2}
      />,
    ];
  }
}
