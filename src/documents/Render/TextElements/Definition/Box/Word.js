import React from "react";
import exists from "app/App/functions/exists";
import { ItalicsAndBold } from "documents/Render/TextElements/Definition/Tooltip";

export default class WordBox extends React.PureComponent {
  render() {
    const { definition } = this.props;
    if (
      !exists(definition) ||
      (!definition.base &&
        !definition.base_meaning &&
        !definition.base_direct &&
        !definition.note &&
        !definition.direct)
    )
      return null;
    return (
      <span
        className="word-box"
        id={`${this.props.id}-box`}
        data-not-text="true"
        hidden={true}
      >
        <span>
          {definition.base && definition.base.trim() && (
            <span className="base">
              <label>Base word</label>
              <span
                dangerouslySetInnerHTML={{
                  __html: ItalicsAndBold(definition.base),
                }}
              />
            </span>
          )}
          {definition.base_meaning && definition.base_meaning.trim() && (
            <span className="base_meaning">
              <label>Meaning of base word</label>
              <span
                dangerouslySetInnerHTML={{
                  __html: ItalicsAndBold(definition.base_meaning),
                }}
              />
            </span>
          )}
          {definition.base_direct && definition.base_direct.trim() && (
            <span className="base_direct">
              <label>Literal meaning of base word</label>
              “
              <span
                dangerouslySetInnerHTML={{
                  __html: ItalicsAndBold(definition.base_direct),
                }}
              />
              ”
            </span>
          )}

          {definition.direct && definition.direct.trim() && (
            <span className="">
              <label>Literal meaning of word</label>
              “
              <span
                dangerouslySetInnerHTML={{
                  __html: ItalicsAndBold(definition.direct),
                }}
              />
              ”
            </span>
          )}

          {definition.note && definition.note.trim() && (
            <span className="small">
              <label>Note</label>
              <span
                dangerouslySetInnerHTML={{
                  __html: ItalicsAndBold(definition.note),
                }}
              />
            </span>
          )}

          {definition.grammatical_analysis &&
            definition.grammatical_analysis.trim() && (
              <span className="small">
                <label>Note</label>
                {definition.grammatical_analysis}
              </span>
            )}
        </span>
        {definition.sound && definition.sound.length > 0 && <span>🔈</span>}
        {definition.pronunciation && (
          <span className="small">
            <label>Pronunciation</label>
            <span
              className="pronunciation"
              dangerouslySetInnerHTML={{ __html: definition.pronunciation }}
            />
          </span>
        )}
      </span>
    );
  }
}
