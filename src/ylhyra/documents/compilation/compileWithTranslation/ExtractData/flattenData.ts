import {
  DocumentTitleToFlattenedData,
  FlattenedData,
} from "ylhyra/documents/types/types";

export const flattenData = (
  input: DocumentTitleToFlattenedData
): FlattenedData => {
  let output: FlattenedData = {
    translation: {
      definitions: {},
      sentences: {},
      words: {},
    },
    long_audio: {},
  };

  for (const documentTitle of Object.keys(input)) {
    output = mergeFlattenedData(output, input[documentTitle]);
  }

  return output;
};

const mergeFlattenedData = (
  first: FlattenedData,
  second: FlattenedData
): FlattenedData => {
  if (typeof first === "object") {
    let output: FlattenedData = first;
    if (second && typeof second === "object") {
      for (const key of Object.keys(second)) {
        // @ts-ignore
        if (output[key]) {
          // @ts-ignore
          output[key] = mergeFlattenedData(output[key], second[key]);
        } else {
          // @ts-ignore
          output[key] = second[key];
        }
      }
    }
    return output;
  } else {
    throw new Error(
      `Merge() can only merge FlattenedData objects, received: ${first}`
    );
  }
};
