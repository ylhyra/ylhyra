# Code overview

When documents are loaded, Markdown is firsted compiled. Then the document is [parsed](Parsing.md), extracting the accompanying data and text. The text is [tokenized](Tokenization.md) (split into words and sentences), then the tokenization is [merged with the original HTML](Wrap_in_tags.md), and is then [merged with the data](Compiler.md).

## Table of contents

- Text editor
  - [Parsing](Parsing.md)
    - [Wrap in tags](Wrap_in_tags.md)
  - [Translator](Translations.md)
  - [Audio](Audio.md)
  - [Compiler](Compiler.md)
- [Text reader](Text_reader.md)
