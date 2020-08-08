/*
  Turns BÍN classification into English
  Descriptions from https://bin.arnastofnun.is/gogn/k-snid
*/
export default (input) => {
  const { word_class, grammatical_tag, ...rest } = input
  if(!grammatical_tag && !word_class) return input;
  let classification = []
  if (word_class === 'kk') {
    classification.push('noun')
    classification.push('masculine')
  }
  if (word_class === 'kvk') {
    classification.push('noun')
    classification.push('feminine')
  }
  if (word_class === 'hk') {
    classification.push('noun')
    classification.push('neuter')
  }
  tags.forEach(tag => {
    if (grammatical_tag.match(new RegExp(tag[0]))) {
      classification.push(tag[1])
    }
  })
  if (grammatical_tag.match(/gr/)) {
    classification.push('with definite article')
  } else {
    classification.push('without definite article')
  }

  /* If it ends in a number it is an alternative version */
  const variantNumber = (grammatical_tag.match(/(\d)$/) ? grammatical_tag.match(/(\d)$/)[0] : 1).toString()
  classification.push(variantNumber)

  // console.warn(classification)
  return {
    classification,
    ...rest,
  }
}

const word_classes = {
  kk: 'noun-masculine',
  kvk: 'noun-feminine',
  hk: 'noun-neuter',
  fs: 'preposition',
  ao: 'adverb',
  gr: 'article',
  lo: 'adjective',
  nhm: 'infinitive particle',
  so: 'verb',
  st: 'conjunction',
  uh: 'interjection',
  to: 'numeral',
  rt: 'ordinal number',

  /* Pronouns */
  fn: 'pronoun',
  afn: 'reflexive pronoun',
  pfn: 'personal pronoun',
}


let tags = {
  /* Plurality */
  ET: 'singular',
  FT: 'plural',

  /* Cases */
  NF: 'nominative',
  ÞF: 'accusative',
  ÞGF: 'dative',
  EF: 'genitive',

  /* Persons */
  1P: 'first person',
  2P: 'second person',
  3P: 'third person',

  /* Genders */
    kk: 'noun-masculine',
    kvk: 'noun-feminine',
    hk: 'noun-neuter',

    // /* genders */
    // "kk", "kvk", "hk"
    // /* tense */
    // "þt", "nt"
    // /* degree */
    // "mst", "esb", "evb"
    // /* voice */
    // "mm", "gm"
    // /* mood */
    // "fh", "lhþt", "lhnt", "vh", "bh"





  BH
  EF
  EFET
  EFETgr
  EFFT
  EFFTgr
  ESB
  EST
  ET
  EVB
  FH
  FSB
  FST
  FT
  FVB
  GM
  HK
  KK
  KVK
  LHNT
  LHÞT
  MM
  MST
  NFET
  NFETgr
  NFFT
  NFFTgr
  NH
  NT
  OBEYGJANLEGT
  OP
  SAGNB
  SB
  SERST
  SP
  ST
  VB
  VH
  ÞF
  ÞFET
  ÞFETgr
  ÞFFT
  ÞFFTgr
  ÞGF
  ÞGFET
  ÞGFETgr
  ÞGFFT
  ÞGFFTgr
  ÞT
  það


}
