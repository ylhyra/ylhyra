// import GetSound from 'documents/Parse/Compiler/2_CompileToHTML/Sound'
import React from "react";
import _ from "underscore";
import exists from "ylhyra/app/app/functions/exists";
import { getUpdatedId } from "ylhyra/documents/parse/Compiler/1_Precompile/UpdateID";
import Box, { DefinitionObject } from "ylhyra/documents/parse/Compiler/2_CompileToHTML/Definition/Box/Word";
import InlineTranslation from "ylhyra/documents/parse/Compiler/2_CompileToHTML/Definition/InlineTranslation";
import Tooltip from "ylhyra/documents/parse/Compiler/2_CompileToHTML/Definition/Tooltip";

export default class WordElement extends React.Component<{
  definition: DefinitionObject;
  id: string;
  appendText?: string;
}> {
  render() {
    const { id, definition, appendText } = this.props;
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
        definition.difficult ? "difficult" : null,
        definition.show_definition_above ? "has-inline-translation" : null,
      ];

      /*
        [data-connected-words]
      */
      if (definition.contains.length > 1) {
        attrs["data-connected-words"] = _.uniq(
          definition.contains.map((id) => getUpdatedId(id))
        )
          .filter((i) => i !== id)
          .join(",");
      }
    } else {
      classes.push("missing");
    }

    return [
      <Box id={id} definition={definition} key={1} hidden={true} />,
      <Tooltip id={id} definition={definition} key={2} hidden={true} />,
      <span className={`word-container ${classes.join(" ")}`} key={3}>
        <span className="word" {...attrs} id={id} data-will-have-audio="true">
          {this.props.children}
        </span>
        <InlineTranslation definition={definition} />
        {appendText}
      </span>,
    ];
  }
}
