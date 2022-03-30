import exists from "app/app/functions/exists";
import { getUpdatedID } from "documents/parse/Compiler/1_Precompile/UpdateID";
import Box, {
  DefinitionObject,
} from "documents/parse/Compiler/2_CompileToHTML/Definition/Box/Word";
import InlineTranslation from "documents/parse/Compiler/2_CompileToHTML/Definition/InlineTranslation";
import Tooltip from "documents/parse/Compiler/2_CompileToHTML/Definition/Tooltip";
// import GetSound from 'documents/Parse/Compiler/2_CompileToHTML/Sound'
import omitEmpty from "omit-empty";
import React from "react";
import _ from "underscore";

class WordElement extends React.Component<{
  definition: DefinitionObject;
  id: string;
  appendText?: string;
}> {
  render() {
    const { id, definition, appendText } = this.props;
    let classes = [];
    let attrs = {};
    if (exists(definition)) {
      attrs = omitEmpty({
        "data-word-has-definition": true,
        // 'data-sound': GetSound(id, editor),
        // 'data-analysis': get_analysis(id, editor),
      });

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
          definition.contains.map((id) => getUpdatedID(id))
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

export default WordElement;
