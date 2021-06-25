To compile, we take in the following information:

- `parsed`: A JSON representation of the HTML input, with <Word/> and <Sentence/> tags.
- `translation`: A list of translated words and sentences.

## Step 1: *Precompiling*

- We loop through the JSON representation of the HTML and:
  - Merge together adjacent words belonging to the same translation.
  - Add adjacent punctuation to words
    - This is necessary for properly displaying inline translations, which sometimes take up a lot of space.
    - This prevents hanging commas and periods.

## Step 2: *Compile to HTML*

- Here we render the HTML using React.
- Tooltips and inline translation elements are created.
- This is then rendered to a string using `ReactDOMServer.renderToStaticMarkup()`.