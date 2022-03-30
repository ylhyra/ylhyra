"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeVowellikeClusters = exports.removeLastVowelCluster = exports.isVowellikeCluster = exports.splitOnAll = exports.getVowelClusters = exports.splitOnVowelRegions = exports.splitOnVowels = exports.endsInConsonant = exports.endsInVowel = exports.vowellike_clusters = exports.dipthongs = exports.vowels = exports.characters = void 0;
/*
  Various helper functions
*/
const word_1 = __importDefault(require("inflection/tables/word"));
exports.characters = "a-záéíóúýðþæö";
exports.vowels = "aeiouyáéíóúýæö";
exports.dipthongs = "au|e[yi]";
exports.vowellike_clusters = `au|e[yi]|j[auúóöyi]`; // Umlaut (hljóðvarp) and Germanic a-mutation (klofning)
const endsInVowel = (input) => {
    let string;
    if (input instanceof word_1.default) {
        string = input.getFirstValue();
    }
    else {
        string = input;
    }
    // if (typeof string !== 'string') throw new Error('endsInVowel expected string');
    return string && new RegExp(`[${exports.vowels}]$`, "i").test(string);
};
exports.endsInVowel = endsInVowel;
const endsInConsonant = (string) => {
    // if (typeof string !== 'string') throw new Error('endsInConsonant expected string');
    return !(0, exports.endsInVowel)(string);
};
exports.endsInConsonant = endsInConsonant;
const splitOnVowels = (string) => {
    // if (typeof string !== 'string') throw new Error('splitOnVowelRegions expected string');
    return (string &&
        string.split(new RegExp(`(${exports.vowellike_clusters}|[${exports.vowels}])`, "ig")));
};
exports.splitOnVowels = splitOnVowels;
const splitOnVowelRegions = (string) => {
    // if (typeof string !== 'string') throw new Error('splitOnVowelRegions expected string');
    return (string &&
        string.split(new RegExp(`(${exports.vowellike_clusters}|[${exports.vowels}]+)`, "ig")));
};
exports.splitOnVowelRegions = splitOnVowelRegions;
const getVowelClusters = (string) => {
    // if (typeof string !== 'string') throw new Error('splitOnVowelRegions expected string');
    return (string &&
        string.match(new RegExp(`(${exports.vowellike_clusters}|[${exports.vowels}])`, "ig")));
};
exports.getVowelClusters = getVowelClusters;
const splitOnAll = (string) => {
    // if (typeof string !== 'string') throw new Error('splitOnAll expected string');
    return (string &&
        string
            .split(new RegExp(`(${exports.vowellike_clusters}|[${exports.characters}])`, "i"))
            .filter(Boolean));
};
exports.splitOnAll = splitOnAll;
const isVowellikeCluster = (string) => {
    // if (typeof string !== 'string') throw new Error('splitOnAll expected string');
    return new RegExp(`(${exports.vowellike_clusters}|[${exports.vowels}]+)`, "i").test(string);
};
exports.isVowellikeCluster = isVowellikeCluster;
const removeLastVowelCluster = (string) => {
    // if (typeof string !== 'string') throw new Error('removeLastVowelCluster expected string');
    return (string &&
        string.replace(new RegExp(`(${exports.vowellike_clusters}|[${exports.vowels}]+)$`, "i"), ""));
};
exports.removeLastVowelCluster = removeLastVowelCluster;
const removeVowellikeClusters = (string) => {
    return (string &&
        string.replace(new RegExp(`(${exports.vowellike_clusters}|[${exports.vowels}]+)`, "ig"), ""));
};
exports.removeVowellikeClusters = removeVowellikeClusters;
