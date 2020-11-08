The project uses [MediaWiki](https://www.mediawiki.org/wiki/Manual:What_is_MediaWiki%3F) as a content management system and [React](https://reactjs.org/) in the frontend.

When documents are loaded, the frontend plugin [parses the document](Parsing), extracts the accompanying data and text. The text is [tokenized](https://ylhyra.is/Software:Tokenization) (split into words and sentences), then the tokenization is [merged with the original HTML](https://ylhyra.is/Software:Wrap_in_tags), and is then [merged with the data](https://ylhyra.is/Software:Compiler.md).

The output of the above is then [rendered](Render/edit?redlink=1). We replace templates with the interactive React elements, for example {{[multiple choice](https://ylhyra.is/Template:Multiple_choice)}} becomes [Card](../../project/text-plugin/Render/Elements/Vocabulary/Types/Multiple.js) and {{[audio](https://ylhyra.is/Template:Audio)}} becomes [Audio](https://github.com/ylhyra/ylhyra/blob/master/project/text-plugin/Render/Audio/index.js.md).

Annotated texts are not replaced with React elements, instead they are created as normal DOM elements in the [compilation step](Compiler). We [listen to mouse movements](https://ylhyra.is/Software:EventListener.md) and show the relevant tooltips.





- Text editor
  - Parsing
    - [Wrap in tags](Wrap_in_tags.md)
  - [Translator](Editor/Translations.md)
  - [Audio](Audio.md)
  - [Compiler](Compiler.md)
- Text reader
  - [EventListener](EventListener.md)
  - [Games](Games.md)

