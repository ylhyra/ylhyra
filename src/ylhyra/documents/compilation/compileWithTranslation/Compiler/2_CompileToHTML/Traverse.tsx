import { Jsx } from "modules/typescript/jsx";
import React from "react";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import { SentenceContainer } from "ylhyra/documents/compilation/compileWithTranslation/Compiler/2_CompileToHTML/Sentence";
import { WordContainer } from "ylhyra/documents/compilation/compileWithTranslation/Compiler/2_CompileToHTML/Word";
import { FlattenedData } from "ylhyra/documents/types/types";

/**
 * Here tooltips and inline translation elements are created.
 */
const Traverse = ({
  json,
  data,
  index,
}: {
  json: HtmlAsJson;
  data: FlattenedData | undefined;
  index?: Number;
}): Jsx => {
  if (!json) return null;
  const { node, tag, attr, child, text } = json;
  if (node === "element" || node === "root") {
    let Tag: any = tag;
    if (node === "root") {
      return child?.map((e, i) => Traverse({ json: e, data, index: i }));
    }
    if (tag === "word") {
      Tag = WordContainer;
    } else if (tag === "sentence") {
      Tag = SentenceContainer;
    }

    if (Tag) {
      return (
        <Tag
          key={attr?.id || index}
          /** Pass data to word and sentence tags in an attribute named "data" */
          {...(tag === "word" || tag === "sentence" ? { data: data } : {})}
          {...attr}
        >
          {child?.map((e, i) => Traverse({ json: e, data, index: i }))}
        </Tag>
      );
    }
  } else if (node === "text") {
    return text;
  } else {
    return null;
  }
};

export default Traverse;
