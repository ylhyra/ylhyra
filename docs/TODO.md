### Orðaforði

- Hvað ef vafri er með vitlausan tíma?
- Related cards
- skrá sessions
- uppfæra schedule á gluggum sem hafa verið opnir lengi
- ef maður skráir sig inn, blanda progress
- loadnewcards ætti að hunsa spjöld sem dependa á nýleg spjöld
- auto dependency ignore circular

### Annað

- gitlistener error reporting í build step
- axios retry
- database backup
- laga egg í áskrift

### Parsing

* Parse->Merge virkar ekki rétt innan í <em/>, kíkja á http://localhost:3000/bl%C3%A6r/silfursvanurinn/3: krók og kima, hliðstæð orð ættu að mergast!!!
* html2json er löturhægt á stórum fælum
* Parsing should not take 4 seconds on huge documents.
  - [WrapInTags](Wrap_in_tags.md) is doing too many json2html calls
  - renderToStaticMarkup should be removed from CompileToHTML, as it can take 300ms on large documents
* There should be no perceptible lag on mouse hover, but there is for some reason on large documents on Android phones.
* Run in Docker so that Windows users can contribute.
* Audio synchronization must be put as a queued process.
* [Project:Software work in progess/Útlit](https://ylhyra.is/Project:Software_work_in_progess/Útlit)

### Efni

* "verst hvað maður er orðinn" í silfur 8 - ekki beint!
