export const classify = (input) => {
  // console.log(input)
  const { word_class, grammatical_tag } = input
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
    classification.push('with-article')
  } else {
    classification.push('without-article')
  }

  /* If it ends in a number it is an alternative version */
  const variantNumber = (grammatical_tag.match(/(\d)$/) ? grammatical_tag.match(/(\d)$/)[0] : 1).toString()
  classification.push(variantNumber)

  // console.warn(classification)
  return classification
}

let tags = [
  /* Tala */
  ['ET', 'singular'],
  ['FT', 'plural'],
  /* Föll */
  ['NF', 'nominative'],
  ['ÞF', 'accusative'],
  ['ÞGF', 'dative'],
  ['EF', 'genitive'],
]
