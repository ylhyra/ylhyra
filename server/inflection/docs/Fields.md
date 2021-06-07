These are the fields that may be returned by the API. They are adapted from [the dataset's original fields](https://bin.arnastofnun.is/DMII/LTdata/k-format/) from the Árni Magnússon Institute for Icelandic Studies.

**Basic fields:**

- `BIN_id` (type: integer)
  - The ID of the word as listed on the BÍN (Beygingarlýsing íslensk nútímamáls)
- `base_word` (type: string)
  - Dictionary headword
- `inflectional_form` (type: string)
  - Word form, this value is the one that will be printed. See the 10th field in the [original dataset](https://bin.arnastofnun.is/DMII/LTdata/k-format/).

---

**Grammatical categories:**

- `word_categories` (type: array of strings)
  - Grammatical categories that apply to the word in general rather than just this inflectional form, such as:
    - ['verb']
    - ['noun', 'masculine']
    - ['reflexive pronoun']
- `inflectional_form_categories` (type: array of strings)
  - Grammatical categories that apply to this particular inflectional form, but not all of its siblings,  such as:
    - ['singular', 'nominative', 1]
    - ['active voice', 'past tense', 1]
  - The last item is always a digit. The main/preferred version of a word form is 1, while alternative versions are 2, 3 and so on.

---

**Correctness:**

- `should_be_taught` (type: boolean)
  - If true, this variant is [prescriptive](https://en.wikipedia.org/wiki/Linguistic_prescription) and should be shown to a language learner.
  - This field represents the variant being a part of the [DMII Core](https://bin.arnastofnun.is/DMII/dmii-core/) (*BÍN kjarninn*).
- `correctness_grade_of_word` (type: integer)
  - See the 5th field in the [original dataset](https://bin.arnastofnun.is/DMII/LTdata/k-format/). As explained there:
    - 1 – **Default** – The word can be used in any context and any style or register.
    - 2 – **Used** – The word is not universally accepted, at least not in the most formal of registers.
    - 3 – **A bit bad** – Not accepted.
    - 4 – **Very bad** – Error, unacceptable.
    - 0 – **No grade** – The word is not used in ordinary context in Modern Icelandic.
- `correctness_grade_of_inflectional_form` (type: integer)
  - See the 12th field in the [original dataset](https://bin.arnastofnun.is/DMII/LTdata/k-format/). As explained there:
    - 1 – **Default** – The inflectional form is universally acceptable.
    - 2 – **Used** – The inflectional form is used but not universally accepted in all contexts or styles.
    - 3 – **A bit bad** – The inflectional form is not accepted.
    - 4 – **Very bad –** Error.
    - 0 – **No grade** – The inflectional form is not used in ordinary context in Modern Icelandic.

---

**Other fields:**

The following fields are returned as a part of the API but are not currently being used to render tables. They contain various extra information about register and relationships to other words.

- `word_register` (type: string)
  - Register or genre. Used to mark word as being formal, poetic, obsolete etc. See the 6th field in the [original dataset](https://bin.arnastofnun.is/DMII/LTdata/k-format/).
- `register_of_inflectional_form` (type: string)
  - See the 13th field in the [original dataset](https://bin.arnastofnun.is/DMII/LTdata/k-format/).
- `grammar_group` (type: string)
  - See the 7th field in the [original dataset](https://bin.arnastofnun.is/DMII/LTdata/k-format/): "The classification is used for the demarcation of features of grammar or usage, mainly to explain lacunae in the paradigms or restrictions on usage."
- `cross_reference` (type: integer)
  - See the 8th field in the [original dataset](https://bin.arnastofnun.is/DMII/LTdata/k-format/).
- `various_feature_markers` (type: string)
  - See the 14th field in the [original dataset](https://bin.arnastofnun.is/DMII/LTdata/k-format/).
- `alternative_entry` (type: integer)
  - See the 15th field in the [original dataset](https://bin.arnastofnun.is/DMII/LTdata/k-format/).
