import exists from "app/app/functions/exists";
import Box from "documents/parse/Compiler/2_CompileToHTML/Definition/Box/Sentence";
import { DefinitionObject } from "documents/parse/Compiler/2_CompileToHTML/Definition/Box/Word";
import React from "react";

class Sentence extends React.Component<{
  definition: DefinitionObject;
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