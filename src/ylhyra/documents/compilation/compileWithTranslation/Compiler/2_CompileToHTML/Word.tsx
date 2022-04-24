// import GetSound from 'documents/Parse/Compiler/2_CompileToHTML/Sound'
import React from "react";
import _ from "underscore";
import exists from "ylhyra/app/app/functions/exists";
import { getUpdatedId } from "ylhyra/documents/compilation/compileWithTranslation/Compiler/1_PrepereForCompilation/UpdateID";
import { WordBox } from "ylhyra/documents/compilation/compileWithTranslation/Compiler/2_CompileToHTML/Definition/Box/WordBox";
import { InlineTranslation } from "ylhyra/documents/compilation/compileWithTranslation/Compiler/2_CompileToHTML/Definition/InlineTranslation";
import { Tooltip } from "ylhyra/documents/compilation/compileWithTranslation/Compiler/2_CompileToHTML/Definition/Tooltip";
import { FlattenedData, WordDefinition } from "ylhyra/documents/types/types";

/**
 * Attributes:
 *   - 'data-connected-words'
 *       Comma seperated string containing the word ids that belong to the same phrase
 *   - 'data-word-has-definition' - {@see SentenceContainer#data-sentence-has-definition}
 *   - 'data-item-that-may-have-audio' - {@see SentenceContainer}
 * Classes:
 *   - 'word-container'
 *   - 'difficult'?
 *   - 'has-inline-translation'?
 */
export class WordContainer extends React.Component<{
  id: string;
  /** @see MergePunctuation */
  punctuationToAppendInsideWordContainer?: string;
  data: FlattenedData | undefined;
}> {
  render() {
    const { id, data, punctuationToAppendInsideWordContainer } = this.props;
    const definition: WordDefinition | undefined =
      data?.translation.definitions[data.translation.words[id!]];

    let classes = [];
    let attrs: { [key: string]: string | boolean } = {};
    if (exists(definition)) {
      attrs = {
        "data-word-has-definition": true,
      };

      /*
        .difficult
        .has-inline-translation
      */
      classes = [
        definition?.difficult ? "difficult" : null,
        definition?.show_definition_above ? "has-inline-translation" : null,
      ];

      /*
        [data-connected-words]
      */
      if (definition && definition?.contains.length > 1) {
        attrs["data-connected-words"] = _.uniq(
          definition.contains.map((id) => getUpdatedId(id))
        )
          .filter((i) => i !== id)
          .join(",");
      }
    } else {
      classes.push("missing");
    }

    return (
      <>
        <WordBox id={id} definition={definition} hidden={true} />
        <Tooltip id={id} definition={definition} hidden={true} />
        <span className={`word-container ${classes.join(" ")}`}>
          <span
            className="word"
            {...attrs}
            id={id}
            data-item-that-may-have-audio="true"
          >
            {this.props.children}
          </span>
          <InlineTranslation definition={definition} />
          {/** @see MergePunctuation */}
          {punctuationToAppendInsideWordContainer}
        </span>
      </>
    );
  }
}
