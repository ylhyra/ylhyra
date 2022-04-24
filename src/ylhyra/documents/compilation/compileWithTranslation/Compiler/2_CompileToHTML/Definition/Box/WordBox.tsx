import React from "react";
import exists from "ylhyra/app/app/functions/exists";
import { WordDefinition } from "ylhyra/documents/types/types";
import { ItalicsAndBold } from "ylhyra/documents/compilation/compileWithTranslation/Compiler/2_CompileToHTML/Definition/functions";

/**
 * Box with extra information shown at the bottom of the screen
 */
export class WordBox extends React.PureComponent<{
  definition: WordDefinition;
  id: string;
  hidden?: boolean;
}> {
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
        lang="en"
      >
        <span>
          {definition.base?.trim() && (
            <span className="base">
              <label>Base word</label>
              <span
                dangerouslySetInnerHTML={{
                  __html: ItalicsAndBold(definition.base),
                }}
              />
            </span>
          )}
          {definition.base_meaning?.trim() && (
            <span className="base_meaning">
              <label>Meaning of base word</label>
              <span
                dangerouslySetInnerHTML={{
                  __html: ItalicsAndBold(definition.base_meaning),
                }}
              />
            </span>
          )}
          {definition.base_direct?.trim() && (
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

          {definition.direct?.trim() && (
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

          {definition.note?.trim() && (
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
        {definition.sound && definition.sound?.length > 0 && <span>🔈</span>}
        {definition.pronunciation && (
          <span className="small">
            <label>Pronunciation</label>
            <span
              className="pronunciation"
              dangerouslySetInnerHTML={{
                __html: definition.pronunciation,
              }}
            />
          </span>
        )}
      </span>
    );
  }
}
