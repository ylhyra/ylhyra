import simplifyString from "server/translator/helpers/simplifyString";

export default (words, index, contains) => {
  let translation_frame = {};
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
    translation_frame[i + spaces] = word;
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
    translation_frame[i - spaces] = word;
  }

  return Object.keys(translation_frame)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map((key) => {
      const word = translation_frame[key];
      return {
        ...word,
        text: simplifyString(word.text),
        position_relative_to_center_word: parseInt(key),
        is_part_of_definition: contains?.includes(word.id),
      };
    });
};
