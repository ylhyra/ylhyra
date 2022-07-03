import exists from "modules/exists";
import React, { PropsWithChildren } from "react";
import { SentenceBox } from "ylhyra/documents/compilation/compileWithTranslation/Compiler/2_CompileToHTML/Definition/Box/SentenceBox";
import { FlattenedData } from "ylhyra/documents/types/types";

/**
 * Attributes:
 *   - 'data-sentence-has-definition' (boolean)
 *        Used by the mouse event listener to find sentences to show.
 *   - 'data-item-that-may-have-audio' (boolean)
 *        Used to find all areas of the document that would be read out loud.
 *        Only used when creating the document, now used by the user.
 * Classes:
 *   - 'sentence'
 *   - 'missing'? – if the sentence is missing a definition
 */
export class SentenceContainer extends React.Component<{
  id: string;
  data: FlattenedData | undefined;
} & PropsWithChildren> {
  render() {
    const { id, data } = this.props;
    const definition = data?.translation.sentences[id];
    let attrs = {};
    let classes = [];
    if (exists(definition) && definition!.meaning?.trim()) {
      attrs = {
        "data-sentence-has-definition": true,
      };
    } else {
      classes.push("missing");
    }
    return (
      <>
        <SentenceBox id={id} definition={definition} />
        <span
          className={`sentence ${classes.join(" ")}`}
          {...attrs}
          id={id}
          data-item-that-may-have-audio="true"
          lang="is"
        >
          {this.props.children}
        </span>
      </>
    );
  }
}
