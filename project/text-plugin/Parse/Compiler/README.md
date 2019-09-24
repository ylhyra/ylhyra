<h1 align="center">
	🏭 Text compiler
</h1>

To compile, we take in the following information:

- `parsed`: A JSON representation of the HTML input, with <Word/> and <Sentence/> tags.
- `translation`: A	list of translated words and sentences.
- `audio`: A list of audio files and their synchronization map.


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
- Reasons for compiling to static HTML instead of dynamic React:
	- Reduces load on user's computer. The document can be opened instantly.
	- React can become unnecessarily slow with thousands of elements listening to updates fired by our Mouse-event-listener.
	- Files can now be opened and shared without having to live inside a React instance.
