import React from "react";
import exists from "ylhyra/app/app/functions/exists";
import { WordDefinition } from "ylhyra/documents/types/translationTypes";

export default class Definition extends React.PureComponent<{
  definition: WordDefinition;
  id: string;
  hidden?: Boolean;
}> {
  render() {
    const { definition, id } = this.props;
    if (!exists(definition) || !definition.meaning) {
      return null;
    }
    return (
      <small
        className="tooltip"
        // style={{display:'none'}}
        data-not-text="true"
        id={`${id}-tooltip`}
        hidden={true}
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
      </small>
    );
  }
}

export const ItalicsAndBold = (input) => {
  return input
    .replace(/\*\*([^ ].+?[^ ])\*\*/g, "<b>$1</b>")
    .replace(/\*([^ ].+?[^ ])\*/g, "<i>$1</i>")
    .replace(/_([^ ].+?[^ ])_/g, "<i>$1</i>");
};
