## Translation

The translation is saved in `documents.translation`.

It contains three objects:

- `sentences`
  - Stores a list of **sentence definitions**.
  - Each sentence definition contains:
    - `meaning` - A translation of sentence that should convey most of the sentence’s nuances.
    - `direct` - Direct translation of sentence, if necessary.
    - `note` - Explains cultural connotations, if necessary.
- `words`
  - Points to a definition.
  - Since several words can make up a single phrase, multiple words can point to the same definition
- `definitions`
  - Stores a list of **word or phrase definitions**.
  - Contains a list words that point to it in `contains`.
  - Each word definition contains:
    - `meaning` - Word translation that should convey most of the meaning.
    - `direct` - Direct translation of word, if necessary.
    - `note` - Explains cultural connotations, if necessary.
    - `base` - Icelandic base version of word (without inflections).
    - `base_meaning` - Translation of the base version (without inflections).
    - `base_direct` - Translation of the base version, if necessary.
    - `difficult` - **Boolean** - If this word is too difficult it will be shown as gray.
    - `show_definition_above` - **Boolean** - Should we show the word definition above it. Usually reserved for difficult words.
    - `inline_translation`
      - If`show_definition_above` is selected, `inline_translation` will be shown above it. If `inline_translation` is empty, `meaning` will be shown.

## Suggestions

[…]
