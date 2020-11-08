When the plugin `text-plugin/index.js` is initialized it calls:

- Parse
  - Extracts the text from the document and the various documents that might be [transcluded](https://www.mediawiki.org/wiki/Transclusion).
  - [Tokenizes](https://ylhyra.is/Project:Technical_documentation/Tokenization/edit?redlink=1) (splits the extracted text into sentences and words).
  - Groups by the document they belong to.
- [Editor](https://ylhyra.is/Project:Technical_documentation/Editor/edit?redlink=1)







# 📖 Text reader plugin

This is the plugin for reading the annotated texts.

It is written in vanilla Javascript in order to guarantee smooth reading performance on older devices, and so that text can be easily embedded on other sites.

## Mouse listener & tooltips

Instead of listening to `onMouseEnter` events, we listen to all mouse and touch movements. This gives us the ability to have more fluidity in our interactions, `onMouseEnter` isn’t very reliable and it’s impossible to give the experience touchscreen users are accustomed to only by using `onTouch` events.

For mouse movements we find the closest elements that are annotated. Only annotated elements have the HTML attributes `[data-word-id]` or `[data-sentence-id]`.

## Inline translations

When initializing the document, inline translations must be repositioned so that they fit. We attempt to position the element so that it’s it the middle of the lines, and then we make sure that it fits by giving the parent (the word element) a minWidth.

## Audio

<audio/> is currently managed by the Picobel plugin, but it needs to be taken out since it doesn’t play well with our eventListeners.

### Text highlighting in sync with audio

The `<audio/>` tag:

- Has a `[data-synchronization-list]` attribute containing synchronization timings.

- Sends all its events to

   

  ```
  window.audioEventListener()
  ```

   

  which will:

  - Find the elements for the current time according to the synchronization timing map.

  - Add a highlight to them with the `.audio` CSS class.

  - Scroll the elements into view.

  - Set a

     

    ```
    setTimeout()
    ```

     

    that fires when the next element should be highlighted.

    - This has to be done since `<audio/>` only fires events every ~250ms when playing.