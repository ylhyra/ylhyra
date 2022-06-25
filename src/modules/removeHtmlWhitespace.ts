const block = "(?:div|table|tbody|td|tr|th|ul)";
export function removeHtmlWhitespace(input) {
  return input
    .replace(/([\s\n]+)/g, " ")
    .replace(new RegExp(`(<${block}( [^>]+)?>) `, "gi"), "$1")
    .replace(new RegExp(` (</${block})`, "gi"), "$1");
}
