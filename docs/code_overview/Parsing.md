# Parsing

When a page is loaded, the document is sent to be parsed. It goes through the following steps:

- **HTML→JSON** – [project/text-plugin/Parse/index.js](../../project/text-plugin/Parse/index.js) converts the HTML to JSON.
- **Find previous data** – At the top of all documents is the {{[start](https://ylhyra.is/Template:Start)}} template, which loads the accompanying data. For example, when [Help:Getting started](https://ylhyra.is/Help:Getting_started) is loaded, the data in [Data:Help:Getting started](https://ylhyra.is/Data:Help:Getting_started) will be loaded by the {{[start](https://ylhyra.is/Template:Start)}} template. [ExtractData](../../project/text-plugin/Parse/ExtractData/index.js) groups this data by document title, since multiple documents may be transcluded on the same page.
- **Extract text** – Then the document's text is extracted. [Paragraphs.js](../../project/text-plugin/Parse/ExtractText/Paragraphs.js) groups paragraphs of text together, when it finds elements with the attribute `data-translate=true` it sends the text to [ExtractText.js](https://github.com/ylhyra/ylhyra/tree/master/text-plugin/Parse/ExtractText/ExtractText.js) which then groups together text belonging to the same document (since other documents might be [transcluded](https://www.mediawiki.org/wiki/Transclusion) in the middle of other documents).
- **[Tokenization](Tokenization.md)**
- **[Wrap in tags](Wrap_in_tags.md)** – Now we merge the tokenization with the HTML to produce `<sentence/>` and `<words/>` tags
- **[Compile](Compiler.md)**