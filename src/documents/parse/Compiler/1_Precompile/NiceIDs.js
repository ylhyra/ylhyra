import {
  updateID,
  getUpdatedID,
} from "documents/parse/Compiler/1_Precompile/UpdateID";

/*

  The IDs were long random strings, but are here converted into:
  "[documentID]_[serial]"

*/

let serial;
let document_id;

export default function init(input, id) {
  document_id = id;
  serial = 0;

  input = NiceIDs(input);
  input = UpdateReferencedIDs(input);

  return input;
}

const NiceIDs = (input) => {
  if (!input) return input;
  const { tag, attr, child } = input;
  const id = attr?.id || null;
  if (tag === "sentence" || tag === "word") {
    return {
      ...input,
      child: child?.map((e) => NiceIDs(e)),
      attr: {
        ...attr,
        id:
          id &&
          updateID(
            id,
            `i${serial++}`
            // `${document_id}_${serial++}`
          ),
      },
    };
  }
  return {
    ...input,
    child: child?.map((e) => NiceIDs(e)),
  };
};

/*
  Here we update the IDs in "definition.contains"
*/
const UpdateReferencedIDs = (input, idsToOutput) => {
  if (!input) return input;
  const { tag, attr, child } = input;
  const id = attr?.id || null;
  const definition = attr?.definition || null;
  if (tag === "sentence" || tag === "word") {
    return {
      ...input,
      child: child?.map((e) => UpdateReferencedIDs(e, idsToOutput)),
      attr: {
        ...attr,
        definition: definition && {
          ...definition,
          contains: definition.contains?.map(getUpdatedID),
        },
      },
    };
  }
  return {
    ...input,
    child: child?.map((e) => UpdateReferencedIDs(e, idsToOutput)),
  };
};
