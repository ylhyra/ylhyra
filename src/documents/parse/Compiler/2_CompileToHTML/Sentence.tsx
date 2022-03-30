import exists from "app/app/functions/exists";
import Box from "documents/parse/Compiler/2_CompileToHTML/Definition/Box/Sentence";
import React from "react";

class Sentence extends React.Component {
  render() {
    const { id, definition } = this.props;
    let attrs = {};
    let classes = [];
    if (exists(definition) && definition.meaning.trim()) {
      attrs = {
        "data-sentence-has-definition": true,
      };
    } else {
      classes.push("missing");
    }
    // console.log(this.props.children)
    return [
      <Box id={id} definition={definition} sentence key={1} hidden={true} />,
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
