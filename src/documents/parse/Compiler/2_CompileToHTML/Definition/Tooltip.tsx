import exists from "app/app/functions/exists";
import React from "react";

export default class Definition extends React.PureComponent {
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
