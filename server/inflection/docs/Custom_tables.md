**(Work in progress)**

URL parameters to construct a custom table:

* `give_me`  (**TODO**: Not a good name)
  * Comma seperated list of what should be highlighted. For example:
    * `plural,nominative`
    * Abbreviations are also supported: `kvk,þgf,með greini`
  * Can be specific or not.
  * Will highlight the first match
* `columns`  and `rows`
  * Comma seperated list, as above
  * *Or*, description of class (such as `cases`, which will return all four cases)
  * Can be empty



[/öpum/8842?give_me=plural,genitive](https://inflections.ylhyra.is/öpum/8842?give_me=plural,genitive)

<pre>
<b>Nom</b>  hér eru apar
<b>Acc</b>  um apa
<b>Dat</b>  frá öpum
<b>Gen</b>  til <b>apa</b>
</pre>
[/fara/433568?rows=infinitive;1p,sing;2p,sing;3p,sing;1p,pl;2p,pl;3p,pl](https://inflections.ylhyra.is/fara/433568?rows=infinitive;1p,sing;2p,sing;3p,sing;1p,pl;2p,pl;3p,pl)

<pre>
   <b>inf</b>  að fara
<b>1p, sg</b>  ég fer
<b>2p, sg</b>  þú ferð
<b>3p, sg</b>  hún fer
<b>1p, pl</b>  við förum
<b>2p, pl</b>  þið farið
<b>3p, pl</b>  þær fara
</pre>



**Other options**

- `embed` Removes the header from the page
