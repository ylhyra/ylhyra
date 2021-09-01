import React from "react";
import Tooltip from "documents/parse/Compiler/2_CompileToHTML/Definition/Tooltip";
import InlineTranslation from "documents/parse/Compiler/2_CompileToHTML/Definition/InlineTranslation";
import exists from "app/app/functions/exists";
import Box from "documents/parse/Compiler/2_CompileToHTML/Definition/Box/Word";
import { getUpdatedID } from "documents/parse/Compiler/1_Precompile/UpdateID";
import _ from "underscore";
// import GetSound from 'documents/Parse/Compiler/2_CompileToHTML/Sound'
import omitEmpty from "omit-empty";

class WordElement extends React.Component {
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

    const shouldShowInline = definition?.show_definition_above;
    const Tag = shouldShowInline ? "ruby" : "span";

    // console.log(definition)
    return [
      <Box id={id} definition={definition} key={1} hidden={true} />,
      <Tooltip id={id} definition={definition} key={2} hidden={true} />,
      <Tag className={`word-container ${classes.join(" ")}`} key={3}>
        <span className="word" {...attrs} id={id} data-will-have-audio="true">
          {this.props.children}
        </span>
        <InlineTranslation definition={definition} />
        {appendText}
      </Tag>,
    ];
  }
}

// const get_analysis = (updatedID, editor) => {
//   const id = getPreviousID(updatedID) || updatedID
//   if (!editor.analysis) return null;
//   const analysis = editor.analysis[id]
//   if (!analysis) return null;
//   // console.log(analysis)
//   return JSON.stringify({
//     BIN_id: analysis.BIN_id,
//     word_class: analysis.word_class,
//     grammatical_tag: analysis.grammatical_tag,
//   })
// }

export default WordElement;
