/*

  Phonetic algorithm for Icelandic, similar to Cologne phonetics

*/
export default (string) => {
  return string
    .replace(/y/g, 'i')
    .replace(/au/g, 'o')
    .replace(/sg/g, 'sk')
    .replace(/hv/g, 'kv')
    .replace(/fnd/g, 'md')
    .replace(/fnt/g, 'mt')
    .replace(/rl/g, 'tl')
    .replace(/x/g, 'ks')
    .replace(/(dn|rn|rdn)/g, 'n')
    .replace(/mb/g, 'm')

    .replace(/[aeiouyj]/g,'a')
    .replace(/(th|dh|d|t|h)/g,'d')
    .replace(/[fvw]/g,'v')
    .replace(/[pb]/g,'p')
    .replace(/[gkqc]/g,'k')
    .replace(/(l|dl)/g,'l')
    .replace(/[mn]/g,'n')
    .replace(/[rs]/g,'s')
    .replace(/([^\w\s])|(.)(?=\2)/g, '') // Remove two in a row
}
