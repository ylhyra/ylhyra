import React from "react";
import exists from "ylhyra/app/app/functions/exists";
import Box from "ylhyra/documents/compilation/compileWithTranslation/Compiler/2_CompileToHTML/Definition/Box/Sentence";
import { FlattenedData } from "ylhyra/documents/types/types";

class Sentence extends React.Component<{
  id: string;
  data: FlattenedData;
}> {
  render() {
    const { id, data } = this.props;
    const definition = data.translation.sentences[id];
    let attrs = {};
    let classes = [];
    if (exists(definition) && definition.meaning?.trim()) {
      attrs = {
        "data-sentence-has-definition": true,
      };
    } else {
      classes.push("missing");
    }
    // console.log(this.props);
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
