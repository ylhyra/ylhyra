# Project overview

## Content

Content is stored as Markdown files in a folder named `ylhyra_content` that must be a sibling directory of the code directory. See the [`ylhyra_content`](https://github.com/ylhyra/ylhyra_content/tree/content) git repository.

### Content files and translation data files

The content files are stored in the `not_data` directory. In the `data` directory their associated translation data files can be found.

The directory structure can be arbitrary, the only thing that matters is the title of the markdown document given in its YAML header.

Translation data files correspond to the content file by their `title` value, an article titled `X` has the associated translation data file `Data:X`. (This naming system is a vestige of when the content was stored in a MediaWiki repository.)

### Content file format

Content files have a YAML metadata header. Consult the `HeaderData` TypeScript type for its format.

Content files allow for a mashup of (limited) MediaWiki syntax, Markdown syntax, and HTML. This is due to the fact that we originally used MediaWiki.

Custom quirks:

* Links use a MediaWiki syntax: `[[article title]]` and `[[article title|text]]`.

* Vocabulary associated with a given article is stored as a raw list in a custom HTML tag named `<vocabulary/>`. This makes it easier to write compared to keeping it in the YAML header.

* Other documents can be transcluded using the MediaWiki `{{document title}}` syntax.

* **Images and files**
  
  * Files are stored in the `ylhyra_content` repository as a pair of files that must have the same name: `X.jpg` (the file itself) and `X.jpg.md` (the metadata for the file).
  
  * The metadata file includes a YAML header containing the file's name (so that it can be linked to) and it's copyright status. The content of that file contains author information that is shown when a user hovers over an image.
  
  * The custom image syntax is <Image src="" position="right" caption=""/> where `src` is the file's title (not the filename).

## Vocabulary
