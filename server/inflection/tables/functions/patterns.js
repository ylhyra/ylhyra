import { types } from 'tables/classification/classification'
import { without } from 'lodash'
const splittableRegexEndingsFromArray = string => {
  return new RegExp(`(${string.sort((a, b) => (b.length - a.length)).join('|')})$`)
}


/**
 * Removes inflectional pattern and returns the rest
 * @param {string} input
 * @param {word} Word
 * @return {?string}
 */
export const removeInflectionalPattern = (input, word) => {
  if (!input) return;
  let stripped = input;

  if (word.isAny('adjective', 'past participle') /*|| word.is('with definite article')*/ ) {
    stripped = input.replace(adjectiveEndings, '')
  } else if (word.is('verb')) {
    stripped = input.replace(verbEndings, '')
  } else if (word.is('noun')) {
    let possible_endings_for_gender = noun_endings[word.getType('gender')] /*[word.getType('plurality')][word.getType('article')]*/
    const sibling_classification = without(word.getFirstClassification(), ...types['cases'])
    const siblings = word.getOriginal().get(...sibling_classification).get(1)
    const word_case_index = types['cases'].indexOf(word.getType('case'))
    let ending = ''
    /* Find exact pattern matches for primary variants */
    if (word.is(1)) {
      const result = possible_endings_for_gender.find(pattern => {
        return pattern.every((ending, index) => {
          const case_ = types['cases'][index]
          const value = siblings.get(case_).getFirstValue()
          if (value) {
            return (new RegExp(`${ending}$`)).test(siblings.get(case_).getFirstValue())
          } else {
            if (process.env.NODE_ENV === 'development') {
              throw new Error(`Sure that there is no ${case_} for ${input}?`)
            }
            return true
          }
        })
      })
      if (result) {
        ending = result[word_case_index]
        // console.log('Found ending for ' + input)
        // console.log(result)
      } else {
        if (process.env.NODE_ENV === 'development') {
          throw new Error('!!!!!!! Did not find ending for ' + input)
        }
      }
    }
    /* Secondary variants get just a quick check */
    else {
      const result = possible_endings_for_gender
        .map(pattern => pattern[word_case_index])
        .sort((a, b) => b.length - a.length)
        .find(ending => {
          return (new RegExp(`${ending}$`)).test(input)
        })
      if (result) {
        ending = result
      } else {
        // throw new Error('!!!!!!! Did not find ending for ' + input)
      }
    }
    stripped = input.replace(new RegExp(`(${ending})$`), '')
  }
  return stripped
}




/*
  Helper function for above noun arrays
*/
const sortLongest = (arrays) => {
  return arrays.sort((a, b) => b.join('').length - a.join('').length)
}
const noun_endings = {
  masculine: sortLongest([
    // EINTALA
    // "bróðir"
    ['(ir)', '(ur)', '(ur)', '(ur)'],
    ['(ir)inn', '(ur)inn', '(ur)num', '(ur)ins'],
    // "plástur"
    ['(ur)', '(ur)', '(r)i', '(ur)s'],
    ['(ur)inn', '(ur)inn', '(ur)inum', '(ur)sins'],
    // "bátur"
    ['ur', '', 'i', 's'],
    ['urinn', 'inn', 'num', 'sins'],
    // "gangur"
    ['urinn', 'inn', 'inum', 'sins'],
    // "hamar"
    ['inn', 'inn', 'inum', 'sins'],
    // "hringur"
    ['ur', '', '', 's'],
    // "Egill"
    ['', '', 'i', 's'],
    // "sjár"
    ['r', '', '', 'var'],
    ['rinn', 'inn', 'num', 'varins'],
    // "vinur"
    ['ur', '', 'i', 'ar'],
    ['urinn', 'inn', 'inum', 'arins'],
    // "lækur"
    ['ur', '', '', 'jar'],
    ['urinn', 'inn', 'num', 'jarins'],
    // "matur"
    ['ur', '', '', 'ar'],
    ['urinn', 'inn', 'num', 'arins'],
    // "skjár"
    ['r', '', '', 's'],
    ['rinn', 'inn', 'num', 'sins'],
    // "pabbi"
    ['i', 'a', 'a', 'a'],
    ['inn', 'ann', 'anum', 'ans'],
    // "ofn"
    ['', '', 'i', 's'],
    ['inn', 'inn', 'inum', 'sins'],
    // "bíll"
    ['', '', '', 's'],
    ['inn', 'inn', 'num', 'sins'],
    // "morgunn"
    ['unn', 'un', 'ni', 'uns'],
    ['unninn', 'uninn', 'ninum', 'unsins'],
    // "bær"
    ['r', '', '', 'jar'],
    ['rinn', 'inn', 'num', 'jarins'],
    // FLEIRTALA
    // bátar" / "strákar"
    ['ar', 'a', 'um', 'a'],
    ['arnir', 'ana', 'unum', 'anna'],
    // "feður"
    ['ur', 'ur', 'rum', 'ra'],
    ['urnir', 'urna', 'runum', 'ranna'],
    // "hringur"
    ['ir', 'i', 'jum', 'ja'],
    ['irnir', 'ina', 'junum', 'janna'],
    // "vinir"
    ['ir', 'i', 'um', 'a'],
    ['irnir', 'ina', 'unum', 'anna'],
    // "morgunn"
    ['nar', 'na', 'num', 'na'],
    ['narnir', 'nana', 'nunum', 'nanna'],
    // "bændur"
    ['ur', 'ur', 'um', 'a'],
    ['urnir', 'urna', 'unum', 'anna'],
    // "menn"
    ['', '', 'um', 'a'],
    // "bæir"
    ['ir', 'i', 'jum', 'ja'],
    ['irnir', 'ina', 'junum', 'janna'],
  ]),
  // Kvenkyn
  feminine: sortLongest([
    // EINTALA
    // systir
    ['ir', 'ur', 'ur', 'ur'],
    ['irin', 'urina', 'urinni', 'urinnar'],
    // "búð"
    ['', '', '', 'ar'],
    ['in', 'ina', 'inni', 'arinnar'],
    //  "kona"
    ['a', 'u', 'u', 'u'],
    ['an', 'una', 'unni', 'unnar'],
    // "elding"
    ['', 'u', 'u', 'ar'],
    ['in', 'una', 'unni', 'arinnar'],
    // "mjólk"
    ['', '', '', 'ur'],
    ['in', 'ina', 'inni', 'urinnar'],
    // "keppni"
    ['i', 'i', 'i', 'i'],
    ['in', 'ina', 'inni', 'innar'],
    // "á"
    ['', '', '', 'r'],
    ['in', 'na', 'nni', 'rinnar'],
    // FLEIRTALA
    // "systur"
    ['ur', 'ur', 'rum', 'ra'],
    ['urnar', 'urnar', 'runum', 'ranna'],
    // "stúlkur"
    ['ur', 'ur', 'um', 'na'],
    ['urnar', 'urnar', 'unum', 'nanna'],
    // "keppnir"
    ['nir', 'nir', 'num', 'na'],
    ['nirnar', 'nirnar', 'nunum', 'nanna'],
    // "búðir"
    ['ir', 'ir', 'um', 'a'],
    ['irnar', 'irnar', 'unum', 'anna'],
    // "persónur"
    ['ur', 'ur', 'um', 'a'],
    ['urnar', 'urnar', 'unum', 'anna'],
    // "vélar"
    ['ar', 'ar', 'um', 'a'],
    ['arnar', 'arnar', 'unum', 'anna'],
    // "bækur"
    ['ur', 'ur', 'um', 'a'],
    ['urnar', 'urnar', 'unum', 'anna'],
    // "dyr"
    ['', '', 'um', 'a'],
    ['nar', 'nar', 'unum', 'anna'],
    // "ár"
    ['', '', 'm', 'a'],
    ['nar', 'nar', 'num', 'nna'],
  ]),
  // Hvorugkyn
  neuter: sortLongest([
    // EINTALA
    // "ríki"
    ['i', 'i', 'i', 's'],
    // "jójó"
    ['', '', '', 's'],
    // "barn"
    ['', '', 'i', 's'],
    ['ið', 'ið', 'inu', 'sins'],
    // "hjarta"
    ['a', 'a', 'a', 'a'],
    ['að', 'að', 'anu', 'ans'],
    // FLEIRTALA
    // "augu"
    ['u', 'u', 'um', 'na'],
    ['un', 'un', 'unum', 'nanna'],
    // "epli"
    ['i', 'i', 'um', 'a'],
    ['in', 'in', 'unum', 'anna'],
    // "börn"
    ['', '', 'um', 'a'],
    ['in', 'in', 'unum', 'anna'],
    // "hjörtu"
    ['u', 'u', 'um', 'a'],
    ['un', 'un', 'unum', 'anna'],
  ]),

  // masculine: {
  //   singular: {
  //     'with definite article': sortLongest([
  //       // "bróðir"
  //       ['(ir)', '(ur)', '(ur)', '(ur)'],
  //     ]),
  //     'without definite article': sortLongest([]),
  //   },
  //   plural: {
  //     'with definite article': sortLongest([]),
  //     'without definite article': sortLongest([]),
  //   },
  // },
  // feminine: {
  //   singular: {
  //     'with definite article': sortLongest([]),
  //     'without definite article': sortLongest([]),
  //   },
  //   plural: {
  //     'with definite article': sortLongest([]),
  //     'without definite article': sortLongest([]),
  //   },
  // },
  // neuter: {
  //   singular: {
  //     'with definite article': sortLongest([]),
  //     'without definite article': sortLongest([]),
  //   },
  //   plural: {
  //     'with definite article': sortLongest([]),
  //     'without definite article': sortLongest([]),
  //   },
  // },




}

const nounEndings = splittableRegexEndingsFromArray([
  'ri',
  'rið',
  'rinu',
  'rinum',
  'rum',
])

const adjectiveEndings = splittableRegexEndingsFromArray([
  'an',
  'anna',
  'ið',
  'in',
  'inn',
  'inna',
  'innar',
  'inni',
  'ins',
  'inu',
  'inum',
  'na',
  'nar',
  'ni',
  'nir',
  'nu',
  'num',
  'una',
  'unnar',
  'unni',
  'unum',
])

const verbEndings = splittableRegexEndingsFromArray([
  'ðu',
  'ið',
  'iði',
  'ir',
  'ist',
  'ju',
  'juð',
  'jum',
  'jumst',
  'just',
  'st',
  'uði',
  'um',
  'umst',
  'uð',
  'u',
  'i',
  'irðu',
  'juði',
  'usti',
  'justi',
  'istu',
  'andi',
  // Mediopassive
  'isti',
  'usti',
])







export const isHighlyIrregular = (word) => {
  if (word.is('noun')) {
    return isHighlyIrregularNouns.some(i => i.endsWith(word.getBaseWord()))
  }
}

const isHighlyIrregularNouns = [
  /* Masculine */
  'bróðir',
  'faðir',
  'fingur',
  'fótur',
  'maður',
  'vetur',
  /* Feminine */
  'ær',
  'dóttir',
  'hönd',
  'kýr',
  'lús',
  'mær',
  'móðir',
  'mús',
  'sýr',
  'systir',
]
