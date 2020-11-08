# Code overview

The project uses [MediaWiki](https://www.mediawiki.org/wiki/Manual:What_is_MediaWiki%3F) as a content management system and [React](https://reactjs.org/) in the frontend.

When documents are loaded, the frontend plugin [parses the document](Parsing.md), extracts the accompanying data and text. The text is [tokenized](Tokenization.md) (split into words and sentences), then the tokenization is [merged with the original HTML](Wrap_in_tags.md), and is then [merged with the data](Compiler.md).

The output of the above is then [rendered](Comiler.md). We replace templates with the interactive React elements, for example {{[multiple choice](https://ylhyra.is/Template:Multiple_choice)}} becomes [Card](../../project/text-plugin/Render/Elements/Vocabulary/Types/Multiple.js) and {{[audio](https://ylhyra.is/Template:Audio)}} becomes [Audio](https://github.com/ylhyra/ylhyra/blob/master/project/text-plugin/Render/Audio/index.js.md).

Annotated texts are not replaced with React elements, instead they are created as normal DOM elements in the [compilation step](Compiler.md). We listen to mouse movements and show the relevant tooltips.

## Table of contents

- Text editor
  - [Parsing](Parsing.md)
    - [Wrap in tags](Wrap_in_tags.md)
  - [Translator](Translations.md)
  - [Audio](Audio.md)
  - [Compiler](Compiler.md)
- [Text reader](Text_reader.md)
- [Games](Games.md)
