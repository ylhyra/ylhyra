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
    list: {
      arrayOfAllWordIDs: [],
      items: {},
      sentences: {},
      words: {},
    },
    short_audio: {
      soundList: [],
      sounds: {},
      wordID_to_text: {},
    },
    long_audio: {},
  };

  for (const documentTitle of Object.keys(input)) {
    output = merge(output, input[documentTitle]);
  }

  return output;
};

const merge = (first: FlattenedData, second: FlattenedData): FlattenedData => {
  // if (Array.isArray(first)) {
  //   return [...first, ...second];
  // } else
  if (typeof first === "object") {
    let output = first;
    if (second && typeof second === "object") {
      for (const key of Object.keys(second)) {
        if (output[key]) {
          output[key] = merge(output[key], second[key]);
        } else {
          output[key] = second[key];
        }
      }
    }
    return output;
  } else {
    throw new Error("Merge() can only merge FlattenedData objects");
  }
};
