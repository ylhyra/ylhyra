import React from "react";
import exists from "ylhyra/app/app/functions/exists";
import Box from "ylhyra/documents/compilation/compileWithTranslation/Compiler/2_CompileToHTML/Definition/Box/Sentence";
import { WordDefinition } from "ylhyra/documents/types/translationTypes";

class Sentence extends React.Component<{
  definition: WordDefinition;
  id: string;
}> {
  render() {
    const { id, definition } = this.props;
    let attrs = {};
    let classes = [];
    if (exists(definition) && definition.meaning?.trim()) {
      attrs = {
        "data-sentence-has-definition": true,
      };
    } else {
      classes.push("missing");
    }
    return [
      <Box id={id} definition={definition} key={1} />,
      <span
        className={`sentence ${classes.join(" ")}`}
        {...attrs}
        id={id}
        data-will-have-audio="true"
        key={2}
        lang="is"
      >
        {this.props.children}
      </span>,
    ];
  }
}

export default Sentence;
