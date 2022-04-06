import { AllHtmlEntities as Entities } from "html-entities";

const entities = new Entities();

/*
  Adds curly quotes
*/
export default (input: string) => {
  const split = input.split(/(<[\s\S]+?>)/g);
  let output = split
    .map((t, index) => {
      if (index % 2 === 0) {
        return entities.decode(t);
      }
      return `SUBSTITUTION${index}%`;
    })
    .join("");

  output = output
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

  output = output
    .split(/(SUBSTITUTION[0-9]+%)/g)
    .map((j) => {
      if (j.startsWith("SUBSTITUTION")) {
        const x = j.match(/SUBSTITUTION([0-9]+)%/)?.[1];
        return x && split[parseInt(x)];
      }
      return j;
    })
    .join("");

  if (output.includes("SUBSTITUTION")) {
    throw new Error(`Unable to process: ${output}`);
  }
  return output;
};
