<h1 align="center">
	🌮 Wrap in tags
</h1>

This function:

 1. Parses input
 2. Loops over tokenization
 3. Merges tokenization and HTML to produce `<sentence/>` and `<word/>` tags

---

We split up Words and Sentences based on raw text, not based on HTML structure.

The purpose of these functions is to turn this HTML:

    <b>Blabla bla! <i>Bla</i></b> bla bla.

Into:

    <sentence>
      <b>Blabla bla!</b>
    </sentence>
    <sentence>
      <b><i>Bla</i></b> bla bla.
    </sentence>

That is to say, it breaks out of HTML tags at the correct spots in
order to encapsulate the text into <sentence/> tags.
