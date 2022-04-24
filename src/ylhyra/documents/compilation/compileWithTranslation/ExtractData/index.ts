import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import { decodeDataInHtml } from "ylhyra/documents/compilation/compileDocument/functions/functions";
import {
  DocumentTitleToFlattenedData,
  FlattenedData,
} from "ylhyra/documents/types/types";

/**
 * Data is stored in inline data tags,
 * see {@link DocumentationRegardingInlineDataInHtml}
 */
export const ExtractData = (
  input: HtmlAsJson
): DocumentTitleToFlattenedData => {
  let output: DocumentTitleToFlattenedData = {};
  const getNewTitle = new newTitle();
  Traverse(input, ({ documentTitle, data }) => {
    const title = getNewTitle.get(documentTitle);
    output[title] = data;
  });
  return output;
};

const Traverse = (
  input: HtmlAsJson,
  callback: ({
    documentTitle,
    data,
  }: {
    documentTitle: string;
    data: FlattenedData;
  }) => void
): unknown => {
  const { node, attr } = input;
  if (typeof input === "string") return;
  if (node === "text") return;
  if (Array.isArray(input)) {
    return input.map((i) => Traverse(i, callback));
  }
  if (input.child) {
    input.child.map((i) => Traverse(i, callback));
  }
  if (attr && attr["data-document-start"] && attr["data-data"]) {
    try {
      const data: FlattenedData = decodeDataInHtml(attr["data-data"]);
      data &&
        callback({
          documentTitle: attr["data-document-start"],
          data,
        });
    } catch (e) {
      console.error(e);
    }
  }
};

/**
 * Prevent clashes if the same document is transcluded twice
 */
export class newTitle {
  index = 0;
  array: string[] = [];

  get(title: string) {
    if (this.array.includes(title)) {
      title = this.get(title + "1");
    }
    this.array.push(title);
    return title;
  }
}
