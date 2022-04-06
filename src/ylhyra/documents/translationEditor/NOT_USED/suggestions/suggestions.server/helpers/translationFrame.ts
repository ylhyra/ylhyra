import simplifyString from "src/ylhyra/documents/translationEditor/NOT_USED/suggestions/suggestions.server/helpers/simplifyString";

export default (words: string[], index: number, contains?) => {
  let translationFrame = {};
  let spaces = 0;

  /*
    -3, -2, -1,
  */
  for (let i = -1; i + spaces >= -3; i--) {
    const word = words[index + i];
    if (word === " ") {
      spaces++;
      continue;
    } else if (typeof word === "string" || !word) {
      break;
    }
    translationFrame[i + spaces] = word;
  }

  /*
    0, +1, +2, +3,
  */
  spaces = 0;
  for (let i = 0; i - spaces <= 3; i++) {
    const word = words[index + i];
    if (word === " ") {
      spaces++;
      continue;
    } else if (typeof word === "string" || !word) {
      break;
    }
    translationFrame[i - spaces] = word;
  }

  return Object.keys(translationFrame)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map((key) => {
      const word = translationFrame[key];
      return {
        ...word,
        text: simplifyString(word.text),
        position_relative_to_center_word: parseInt(key),
        is_part_of_definition: contains?.includes(word.id),
      };
    });
};
