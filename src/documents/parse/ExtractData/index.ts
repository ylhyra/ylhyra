import { DecodeDataInHTML } from "documents/compile/functions/functions";
import { newTitle } from "documents/parse";

/*
  Returns an object containing:
    DocumentTitle => Data
*/
const ExtractData = (input) => {
  let output = {};

  const getNewTitle = new newTitle();
  Traverse(input, ({ documentTitle, data }) => {
    const title = getNewTitle.get(documentTitle);
    // console.log(data)
    output[title] = updateIDs(data, title);
  });
  return output;
};

const Traverse = (input, callback) => {
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
      let data = attr["data-data"];
      // console.log((decodeURIComponent(atob(data))))
      data = DecodeDataInHTML(data);
      data &&
        callback({
          documentTitle: attr["data-document-start"],
          data,
        });
    } catch (e) {
      // console.error(child[0].text + ' is not parseable JSON')
      console.error(e);
    }
  }
};

export default ExtractData;

/*
  //TODO!
  Prepend title to all IDs to prevent clashing
*/
const updateIDs = (data) => {
  // console.log(data)
  return data;
};
