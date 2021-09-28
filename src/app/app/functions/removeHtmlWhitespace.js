const block = "(?:div|table|td|tr|th|ul)";
export const removeHtmlWhitespace = (input) => {
  return input
    .replace(/([\s]+)/g, " ")
    .replace(new RegExp(`(<${block}( [^>]+)?>) `, "gi"), "$1")
    .replace(new RegExp(` (</${block})`, "gi"), "$1");
};
