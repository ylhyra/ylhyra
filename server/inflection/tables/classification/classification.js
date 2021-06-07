/**
 * Descriptions derived from:
 *  - https://bin.arnastofnun.is/gogn/k-snid and
 *  - https://bin.arnastofnun.is/gogn/greiningarstrengir/
 * By Árni Magnússon Institute for Icelandic Studies
 */
const labels_array = [
  /* Person */
  {
    title: '1st person',
    icelandic_title: '1. persóna',
    type: 'person',
    shortcuts: ['1p'],
    has_article_on_ylhyra: false,
  },
  {
    title: '2nd person',
    icelandic_title: '2. persóna',
    type: 'person',
    shortcuts: ['2p'],
    has_article_on_ylhyra: false,
  },
  {
    title: '3rd person',
    icelandic_title: '3. persóna',
    type: 'person',
    shortcuts: ['3p'],
    has_article_on_ylhyra: false,
  },

  /* Case */
  {
    title: 'nominative',
    icelandic_title: 'nefnifall',
    type: 'case',
    shortcuts: ['nf', 'nom'],
    has_article_on_ylhyra: true,
  },
  {
    title: 'accusative',
    icelandic_title: 'þolfall',
    type: 'case',
    shortcuts: ['þf', 'acc'],
    has_article_on_ylhyra: true,
  },
  {
    title: 'dative',
    icelandic_title: 'þágufall',
    type: 'case',
    shortcuts: ['þgf', 'dat'],
    has_article_on_ylhyra: true,
  },
  {
    title: 'genitive',
    icelandic_title: 'eignarfall',
    type: 'case',
    shortcuts: ['ef', 'gen'],
    has_article_on_ylhyra: true,
  },

  /* Plurality */
  {
    title: 'singular',
    icelandic_title: 'eintala',
    type: 'plurality',
    shortcuts: ['et', 'sing', 'sg', 's'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'plural',
    icelandic_title: 'fleirtala',
    type: 'plurality',
    shortcuts: ['ft', 'plur', 'pl', 'p'],
    has_article_on_ylhyra: false,
  },

  /* Gender */
  {
    title: 'masculine',
    icelandic_title: 'karlkyn',
    type: 'gender',
    shortcuts: ['kk', 'masc'],
    has_article_on_ylhyra: true,
  },
  {
    title: 'feminine',
    icelandic_title: 'kvenkyn',
    type: 'gender',
    shortcuts: ['kvk', 'fem'],
    has_article_on_ylhyra: true,
  },
  {
    title: 'neuter',
    icelandic_title: 'hvorugkyn',
    type: 'gender',
    shortcuts: ['hk', 'hvk', 'neut'],
    has_article_on_ylhyra: true,
  },

  /* Article */
  {
    title: 'without definite article',
    icelandic_title: 'án greinis',
    type: 'article',
    shortcuts: ['ángr', 'no article'],
    has_article_on_ylhyra: true,
  },
  {
    title: 'with definite article',
    icelandic_title: 'með greini',
    type: 'article',
    shortcuts: ['meðgr', 'with article'],
    has_article_on_ylhyra: true,
  },

  /* Tense */
  {
    title: 'present tense',
    icelandic_title: 'nútíð',
    type: 'tense',
    shortcuts: ['nt', 'present', 'pres', 'prs'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'past tense',
    icelandic_title: 'þátíð',
    type: 'tense',
    shortcuts: ['þt', 'past', 'pst'],
    has_article_on_ylhyra: false,
  },

  /* Degree */
  {
    title: 'positive degree',
    icelandic_title: 'frumstig',
    type: 'degree',
    shortcuts: ['fst', 'positive'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'comparative degree',
    icelandic_title: 'miðstig',
    type: 'degree',
    shortcuts: ['mst', 'comparative'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'superlative degree',
    icelandic_title: 'efsta stig',
    type: 'degree',
    shortcuts: ['est', 'superlative'],
    has_article_on_ylhyra: false,
  },

  /* Strong or weak */
  {
    title: 'strong declension',
    icelandic_title: 'sterk beyging',
    type: 'strong or weak',
    shortcuts: ['sb', 'sterk', 'strong'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'weak declension',
    icelandic_title: 'veik beyging',
    type: 'strong or weak',
    shortcuts: ['vb', 'veik', 'weak'],
    has_article_on_ylhyra: false,
  },



  {
    title: 'infinitive',
    icelandic_title: 'nafnháttur',
    type: '',
    shortcuts: ['nh', 'inf'],
    has_article_on_ylhyra: true,
  },
  {
    title: 'indicative',
    icelandic_title: 'framsöguháttur',
    type: '',
    shortcuts: ['fh', 'ind','real','realis','realis mood','indicative mood'],
    has_article_on_ylhyra: true,
  },
  {
    title: 'subjunctive',
    icelandic_title: 'viðtengingarháttur',
    type: '',
    shortcuts: ['vh', 'subj'],
    has_article_on_ylhyra: true,
  },

  {
    title: 'active voice',
    icelandic_title: 'germynd',
    type: '',
    shortcuts: ['gm', 'active'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'middle voice',
    icelandic_title: 'miðmynd',
    type: '',
    shortcuts: ['mm', 'med', 'mediopassive', 'mid'],
    has_article_on_ylhyra: true,
  },
  {
    title: 'imperative',
    icelandic_title: 'boðháttur',
    type: '',
    shortcuts: ['bh', 'imp'],
    has_article_on_ylhyra: true,
  },
  {
    title: 'clipped imperative',
    icelandic_title: 'stýfður boðháttur',
    type: '',
    shortcuts: ['stýfður', 'styfdur', 'clipped'],
    has_article_on_ylhyra: false,
  },

  {
    title: 'present participle',
    icelandic_title: 'lýsingarháttur nútíðar',
    type: '',
    shortcuts: ['lhnt'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'supine',
    icelandic_title: 'sagnbót',
    type: '',
    shortcuts: ['sagnb', 'sup'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'past participle',
    icelandic_title: 'lýsingarháttur þátíðar',
    type: '',
    shortcuts: ['lhþt'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'question form',
    icelandic_title: 'spurnarmynd',
    type: '',
    shortcuts: ['sp'],
    has_article_on_ylhyra: false,
  },





  {
    title: 'optative',
    icelandic_title: 'óskháttur',
    type: '',
    shortcuts: ['oskh'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'not used in a noun phrase',
    icelandic_title: 'sérstætt',
    type: '',
    shortcuts: ['serst'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'personal',
    icelandic_title: 'persónuleg beyging',
    type: '',
    shortcuts: ['persónuleg', 'pers'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'impersonal',
    icelandic_title: 'ópersónuleg beyging',
    type: '',
    shortcuts: ['op'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'impersonal with accusative subject',
    icelandic_title: 'ópersónuleg beyging með frumlag í þolfalli',
    type: '',
    shortcuts: ['op-þf'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'impersonal with dative subject',
    icelandic_title: 'ópersónuleg beyging með frumlag í þágufalli',
    type: '',
    shortcuts: ['op-þgf'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'impersonal with genitive subject',
    icelandic_title: 'ópersónuleg beyging með frumlag í eignarfalli',
    type: '',
    shortcuts: ['op-ef'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'impersonal with dummy subject',
    icelandic_title: 'ópersónuleg beyging með gervifrumlag',
    type: '',
    shortcuts: ['op-það'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'indeclinable',
    icelandic_title: 'óbeygjanlegt',
    type: '',
    shortcuts: ['obeygjanlegt'],
    has_article_on_ylhyra: false,
  },

  /* Word classes */
  {
    title: 'noun',
    icelandic_title: 'nafnorð',
    type: 'class',
    shortcuts: ['no', 'n'],
    has_article_on_ylhyra: true,
  },
  {
    title: 'preposition',
    icelandic_title: 'forsetning',
    type: 'class',
    shortcuts: ['fs', 'pre', 'prep'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'adverb',
    icelandic_title: 'atviksorð',
    type: 'class',
    shortcuts: ['ao', 'adv'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'article',
    icelandic_title: 'greinir',
    type: 'class',
    shortcuts: ['gr'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'adjective',
    icelandic_title: 'lýsingarorð',
    type: 'class',
    shortcuts: ['lo', 'adj', 'a'],
    has_article_on_ylhyra: true,
  },
  {
    title: 'infinitive particle',
    icelandic_title: 'nafnháttarmerki',
    type: 'class',
    shortcuts: ['nhm'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'verb',
    icelandic_title: 'sagnorð',
    type: 'class',
    shortcuts: ['so', 'v'],
    has_article_on_ylhyra: true,
  },
  {
    title: 'conjunction',
    icelandic_title: 'samtenging',
    type: 'class',
    shortcuts: ['st', 'conj'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'interjection',
    icelandic_title: 'upphrópun',
    type: 'class',
    shortcuts: ['uh', 'int'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'numeral',
    icelandic_title: 'töluorð',
    type: 'class',
    shortcuts: ['to'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'ordinal number',
    icelandic_title: 'raðtala',
    type: 'class',
    shortcuts: ['rt', 'ordinal'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'pronoun',
    icelandic_title: 'fornafn',
    type: 'class',
    shortcuts: ['fn'],
    has_article_on_ylhyra: true,
  },
  {
    title: 'reflexive pronoun',
    icelandic_title: 'afturbeygt fornafn',
    type: 'class',
    shortcuts: ['afn'],
    has_article_on_ylhyra: false,
  },
  {
    title: 'personal pronoun',
    icelandic_title: 'persónufornafn',
    type: 'class',
    shortcuts: ['pfn'],
    has_article_on_ylhyra: false,
  },
]




/**
 * Object containing "name => array of tags", used for getting arrays later on, such as types['gender']
 */
let types = {}

/**
 * Abbreviations
 * Object on form {'nf': 'nominative'}
 */
let shortcuts = {}
/* Only for BÍN */
let shortcuts_used_in_BIN = {}

/**
 * Sorted single-level array of tags, used for sorting rows when constructing the tree
 */
let sorted_tags = []

/**
 * Reverses `label` to turn it into a searchable object
 */
let title_to_label = {}


labels_array.forEach(label => {
  /* Types */
  if (label.type) {
    if (!types[label.type]) {
      types[label.type] = []
    }
    types[label.type].push(label.title)
  }

  /* Shortcuts */
  let s = label.shortcuts
  s.push(label.title)
  s.push(label.icelandic_title)
  s.forEach((shortcut, index) => {
    if (shortcuts[shortcut]) {
      throw `SHORTCUT ALREADY EXISTS ${shortcut}`
    }
    shortcuts[shortcut] = label.title
    if (index === 0) {
      shortcuts_used_in_BIN[shortcut] = label.title
    }
  })

  /* Sorted tags */
  sorted_tags.push(label.title)

  /* Reverse lookup */
  title_to_label[label.title] = label
})


const type_aliases = {
  article: ['articles'],
  plurality: ['number'],
  case: ['cases'],
  gender: ['genders'],
  person: ['persons'],
}
Object.keys(type_aliases).forEach(key => {
  type_aliases[key].forEach(type => {
    types[type] = types[key]
  })
})

export const normalizeTag = (tag, strict) => {
  if (!tag) return null;
  if (typeof tag === 'number') return tag;
  if (/^\d+?$/.test(tag)) return parseInt(tag); /* Number on the form of a string */
  if (typeof tag !== 'string') throw new Error(`normalizeTag received type ${typeof tag}`)
  let output = shortcuts[tag] || shortcuts[tag.toLowerCase().trim()]
  if (!output && strict !== false) throw new Error(`Value not recognized: ${tag}`)
  return output
}

export const getTagInfo = (tag, strict) => {
  tag = normalizeTag(tag, strict)
  return tag && title_to_label[tag]
}

export { shortcuts }
export { sorted_tags }
export { types }
export { shortcuts_used_in_BIN }
