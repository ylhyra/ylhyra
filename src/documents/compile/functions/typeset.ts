import { AllHtmlEntities as Entities } from "html-entities";

const entities = new Entities();

/*
  Adds curly quotes
*/
export default (input) => {
  const split = input.split(/(<[\s\S]+?>)/g);
  let tmp = split
    .map((t, index) => {
      if (index % 2 === 0) {
        return entities.decode(t);
      }
      return `SUBSTITUTION${index}%`;
    })
    .join("");
  // console.log(tmp);
  tmp = tmp
    // Curly quotes
    .replace(/"([^"]*)"/g, `“$1”`)
    // Spacing around plusses
    .replace(/ \+ /g, `\u2006<span class="darkgray">+</span>\u2006`)
    // Apostrophe
    .replace(/([a-z])'([a-z])/gi, "$1’$2")
    // Single quotes
    .replace(/'([\s\S]+?)'/g, `‘$1’`)
    // Spacing around "/"
    .replace(/ \/ /g, `\u2006<span class="darkgray">/</span>\u2006`);

  return tmp
    .split(/(SUBSTITUTION[0-9]+%)/g)
    .map((j) => {
      if (j.startsWith("SUBSTITUTION")) {
        const x = j.match(/SUBSTITUTION([0-9]+)%/)[1];
        return split[parseInt(x)];
      }
      return j;
    })
    .join("");
};
