/*
  Various helper functions
*/
import Word from "inflection/tables/word";

export const characters = "a-záéíóúýðþæö";
export const vowels = "aeiouyáéíóúýæö";
export const dipthongs = "au|e[yi]";
export const vowellikeClusters = `au|e[yi]|j[auúóöyi]`; // Umlaut (hljóðvarp) and Germanic a-mutation (klofning)

export const endsInVowel = (input: Word | string | undefined) => {
  let string;
  if (input instanceof Word) {
    string = input.getFirstValue();
  } else {
    string = input;
  }
  // if (typeof string !== 'string') throw new Error('endsInVowel expected string');
  return string && new RegExp(`[${vowels}]$`, "i").test(string);
};

export const endsInConsonant = (string: string | undefined) => {
  // if (typeof string !== 'string') throw new Error('endsInConsonant expected string');
  return !endsInVowel(string);
};

export const splitOnVowels = (string: string): string[] => {
  // if (typeof string !== 'string') throw new Error('splitOnVowelRegions expected string');
  return string.split(new RegExp(`(${vowellikeClusters}|[${vowels}])`, "ig"));
};

/** @hasTests */
export const splitOnVowelRegions = (string: string): string[] => {
  if (typeof string !== "string")
    throw new Error("splitOnVowelRegions expected string");
  return string.split(new RegExp(`(${vowellikeClusters}|[${vowels}]+)`, "ig"));
};

export const getVowelClusters = (string: string | undefined) => {
  // if (typeof string !== 'string') throw new Error('splitOnVowelRegions expected string');
  return (
    string &&
    string.match(new RegExp(`(${vowellikeClusters}|[${vowels}])`, "ig"))
  );
};

export const splitOnAll = (string: string | undefined) => {
  // if (typeof string !== 'string') throw new Error('splitOnAll expected string');
  return (
    string &&
    string
      .split(new RegExp(`(${vowellikeClusters}|[${characters}])`, "i"))
      .filter(Boolean)
  );
};

export const isVowellikeCluster = (string: string) => {
  // if (typeof string !== 'string') throw new Error('splitOnAll expected string');
  return new RegExp(`(${vowellikeClusters}|[${vowels}]+)`, "i").test(string);
};

/** @hasTests */
export const removeLastVowelCluster = (string: string | undefined) => {
  // if (typeof string !== 'string') throw new Error('removeLastVowelCluster expected string');
  return (
    string &&
    string.replace(new RegExp(`(${vowellikeClusters}|[${vowels}]+)$`, "i"), "")
  );
};
const l = [
  ["syngja", "syng"],
  ["já", "j"],
  ["ja", ""],
  ["Kjartan", "Kjartan"],
];

export const removeVowellikeClusters = (string: string): string => {
  return (
    string &&
    string.replace(new RegExp(`(${vowellikeClusters}|[${vowels}]+)`, "ig"), "")
  );
};
