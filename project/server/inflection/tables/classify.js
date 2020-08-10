/*
  Turns BÍN classification into English
  Descriptions from:
  - https://bin.arnastofnun.is/gogn/k-snid and
  - https://bin.arnastofnun.is/gogn/greiningarstrengir/
  © Árni Magnússon Institute for Icelandic Studies, CC BY-SA 4.0
*/
export default (input, give_me) => {
  let { word_class, grammatical_tag, ...rest } = input
  if (!word_class && !grammatical_tag) return input;

  let word_class_output = (word_classes[word_class]).split(', ')

  let form_classification = []
  /* Adjectives: Arrange plurality before gender */
  grammatical_tag = grammatical_tag.replace(/(KK|KVK|HK)-(NF|ÞF|ÞGF|EF)(ET|FT)/, '$3-$1-$2')
  /* Nouns: Arrange plurality before case */
  grammatical_tag = grammatical_tag.replace(/(NF|ÞF|ÞGF|EF)(ET|FT)/, '$2-$1')
  const regex = Object.keys(tags).sort((a, b) => (b.length - a.length)).join('|')
  grammatical_tag.split((new RegExp(`(${regex})`, 'g'))).filter(Boolean).forEach(tag => {
    if (tag === '-') return;
    if (tags[tag]) {
      form_classification.push(tags[tag])
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.error('Unknown tag in classify.js: ' + tag)
      }
    }
  })

  form_classification = form_classification.join(', ').split(', ')

  /* Add "without definite article" to nouns */
  if (word_class_output.includes('noun') && !form_classification.includes('with definite article')) {
    form_classification.push('without definite article')
  }

  // /* Add "personal use" to verbs */
  // if (word_class_output.includes('verb') !form_classification.find(i => i.startsWith('impersonal')) {
  //   form_classification.push('without definite article')
  // }

  /* If it ends in a number it is an alternative version */
  const variantNumber = (grammatical_tag.match(/(\d)$/) ? grammatical_tag.match(/(\d)$/)[0] : 1).toString()
  form_classification.push(variantNumber)

  // form_classification = form_classification.join(', ')

  if (give_me === 'form_classification') {
    return form_classification
  }
  if (give_me === 'word_class') {
    return word_class_output
  }
  return {
    word_class: word_class_output,
    form_classification,
    original_grammatical_tag: grammatical_tag,
    ...rest,
    // ...input,
  }
}

const word_classes = {
  kk: 'noun, masculine',
  kvk: 'noun, feminine',
  hk: 'noun, neuter',
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

const tags = {
  '1P': '1st person',
  '2P': '2nd person',
  '3P': '3rd person',

  'BH': 'imperative',
  'EF': 'genitive',
  'ET': 'singular',
  'FH': 'indicative',

  'FST': 'positive degree', // frumstig
  'FSB': 'positive degree, strong declension',
  'FVB': 'positive degree, weak declension',
  'MST': 'comparative degree', // miðstig
  'EST': 'superlative degree', // efsta stig
  'EVB': 'superlative degree, weak declension',
  'ESB': 'superlative degree, strong declension',

  'FT': 'plural',
  'GM': 'active voice',
  'gr': 'with definite article',
  'HK': 'neuter',
  'KK': 'masculine',
  'KVK': 'feminine',
  'LHNT': 'present participle',
  'LHÞT': 'past participle',
  'MM': 'mediopassive',
  'NF': 'nominative',
  'NH': 'infinitive',
  'NT': 'present tense',
  'OSKH': 'optative',
  'SAGNB': 'supine',
  'SB': 'strong declension',
  'SERST': 'not used in a noun phrase',
  'SP': 'question form',
  'ST': 'clipped imperative', // Stýfður boðháttur
  'VB': 'weak declension',
  'VH': 'subjunctive',
  'ÞF': 'accusative',
  'ÞGF': 'dative',
  'ÞT': 'past tense',
  'OP-ÞF': 'impersonal with accusative subject',
  'OP-ÞGF': 'impersonal with dative subject',
  'OP-EF': 'impersonal with genitive subject',
  'OP-það': 'impersonal with dummy subject',
  'OP': 'impersonal',
  'OBEYGJANLEGT': 'indeclinable',
}

export const sorted_tags = [
  '1st person',
  '2nd person',
  '3rd person',

  'masculine',
  'neuter',
  'feminine',

  'nominative',
  'accusative',
  'dative',
  'genitive',

  /* Verbs */
  'infinitive',
  'indicative', // Framsöguháttur
  'subjunctive', // Viðtengingarháttur

  'active voice', // Germynd
  'mediopassive', // Miðmynd
  'imperative', // Boðháttur
  'clipped imperative', // Stýfður boðháttur
  'present participle',
  'supine',
  'past participle',
  'question form',

  'present tense',
  'past tense',

  'singular',
  'plural',

  /* Adjectives */
  'positive degree', // frumstig
  'positive degree-strong declension',
  'positive degree-weak declension',
  'comparative degree', // miðstig
  'superlative degree', // efsta stig
  'superlative degree-weak declension',
  'superlative degree-strong declension',

  'strong declension',
  'weak declension',

  'optative',
  'not used in a noun phrase',
  'indefinite',
  'with definite article',

  'personal',
  'impersonal',
  'impersonal with accusative subject',
  'impersonal with dative subject',
  'impersonal with genitive subject',
  'impersonal with dummy subject',

  'indeclinable',
]

export const sort_by_classification = (a, b) => {
  /* Sort by single tag */
  if (a.tag) {
    return sorted_tags.indexOf(a.tag) - sorted_tags.indexOf(b.tag)
  }

  /* Sort by full array of classification */
  for (let i = 0; i < a.form_classification.length; i++) {
    if (!b.form_classification[i])
      break;
    if (a.form_classification[i] === b.form_classification[i])
      continue;
    return sorted_tags.indexOf(a.form_classification[i]) - sorted_tags.indexOf(b.form_classification[i])
  }

  /* Sort by variant number */
  return a.variant_number - b.variant_number
}
