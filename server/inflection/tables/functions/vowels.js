/*
  Various helper functions
*/
import Word from 'tables/word'
export const characters = 'a-záéíóúýðþæö'
export const vowels = 'aeiouyáéíóúýæö'
export const dipthongs = 'au|e[yi]'
export const vowellike_clusters = `au|e[yi]|j[auúóöyi]` // Umlaut (hljóðvarp) and Germanic a-mutation (klofning)

export const endsInVowel = (input) => {
  let string
  if (input instanceof Word) {
    string = input.getFirstValue()
  } else {
    string = input
  }
  // if (typeof string !== 'string') throw new Error('endsInVowel expected string');
  return string && (new RegExp(`[${vowels}]$`, 'i')).test(string)
}

export const endsInConsonant = (string) => {
  // if (typeof string !== 'string') throw new Error('endsInConsonant expected string');
  return !endsInVowel(string)
}
export const splitOnVowels = (string) => {
  // if (typeof string !== 'string') throw new Error('splitOnVowelRegions expected string');
  return string && string.split(new RegExp(`(${vowellike_clusters}|[${vowels}])`, 'ig'))
}
export const splitOnVowelRegions = (string) => {
  // if (typeof string !== 'string') throw new Error('splitOnVowelRegions expected string');
  return string && string.split(new RegExp(`(${vowellike_clusters}|[${vowels}]+)`, 'ig'))
}
export const getVowelClusters = (string) => {
  // if (typeof string !== 'string') throw new Error('splitOnVowelRegions expected string');
  return string && string.match(new RegExp(`(${vowellike_clusters}|[${vowels}])`, 'ig'))
}
export const splitOnAll = (string) => {
  // if (typeof string !== 'string') throw new Error('splitOnAll expected string');
  return string && string.split(new RegExp(`(${vowellike_clusters}|[${characters}])`, 'i')).filter(Boolean)
}
export const isVowellikeCluster = (string) => {
  // if (typeof string !== 'string') throw new Error('splitOnAll expected string');
  return (new RegExp(`(${vowellike_clusters}|[${vowels}]+)`, 'i')).test(string)
}
export const removeLastVowelCluster = (string) => {
  // if (typeof string !== 'string') throw new Error('removeLastVowelCluster expected string');
  return string && string.replace((new RegExp(`(${vowellike_clusters}|[${vowels}]+)$`, 'i')), '')
}
export const removeVowellikeClusters = (string) => {
  return string && string.replace((new RegExp(`(${vowellike_clusters}|[${vowels}]+)`, 'ig')), '')
}
