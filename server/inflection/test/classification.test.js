import assert from 'assert'
import classify from './../tables/classification/BIN_classification'

it('BÍN classification', () => {
  assert.deepEqual(
    classify({ word_categories: 'kvk', grammatical_tag: 'FT-ÞF' }).inflectional_form_categories,
    ['plural', 'accusative', 'without definite article', 1]
  )
  assert.deepEqual(
    classify({ word_categories: 'kvk', grammatical_tag: 'FT-ÞF2' }).inflectional_form_categories,
    ['plural', 'accusative', 'without definite article', 2]
  )
  assert.deepEqual(
    classify({ word_categories: 'so', grammatical_tag: 'GM-VH-ÞT-2P-ET2' }).inflectional_form_categories, [
      "active voice",
      "subjunctive",
      "past tense",
      "2nd person",
      "singular",
      2
    ]
  )


// 'GM-NH-ÞT' í gætu   / 479125


  return
})
