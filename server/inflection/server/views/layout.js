export default ({
  title,
  string,
  results,
  id,
  embed,
  did_you_mean_in_footer, /* For when one main variant is shown */
}) => `
<!DOCTYPE html>
<html>
<title>${title && title + ' – ' || ''} Icelandic inflections</title>
<meta charset="utf-8"/>
<!-- <base href="/"/> -->
<link href="/inflection_styles/build.css?build=000000" rel="stylesheet" type="text/css"/>
<!-- <meta name="description" content=""/> -->
<meta name="google" content="notranslate" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<!-- <link rel="shortcut icon" href="/~/favicon.png"> -->

<script type="text/javascript">
if (/[?&](q|id)=/.test(location.search)) {
  var word = location.search.match(/[?&]q=([A-zÀ-ÿ%0-9+]+)/);
  if (word) word = word[1];
  var id = location.search.match(/[?&]id=([A-zÀ-ÿ%0-9+]+)/);
  if (id) id = id[1];
  if ((word || id) && window.history.replaceState) {
    var unused_parameters = location.search.replace(/[?&](q|id)=([A-zÀ-ÿ%0-9+]+)/,'').replace('?','')
    var url = '/' + (word ? word + (id ? '/':'') : '') + (id || '') + (unused_parameters ? '?'+unused_parameters:'')
    window.history.replaceState(null, null, url);
  }
}
</script>
<body>

${!embed ? `
<h1>
  ${title ? `<a href="/">Icelandic inflections</a>` : 'Icelandic inflections'}
</h1>
<form method="get" action="/">
  <input name="q" id="s" placeholder="Search" type="search" value="${string || ''}" spellcheck="false" autocomplete="off"/>
</form>`:''}
<main id="${id ? 'content': ''}">
  ${results || ''}
</main>
<footer>

${/*did_you_mean_in_footer ? `
<ul class="results small">
  ${did_you_mean_in_footer}
</ul>
`:*/ ''}

${id ? `<a href="https://bin.arnastofnun.is/beyging/${id}" target="_blank"><b>View this word on BÍN</b></a>` : ''}

<div class="license">

Data is from the <em><a href="https://bin.arnastofnun.is/DMII/LTdata/k-format/" rel="nofollow">Database of Modern Icelandic Inflection</a></em> (DMII),
or <em>Beygingarlýsing íslensks nútímamáls</em> (BÍN), by the Árni Magnússon Institute for Icelandic Studies. The author and editor of the DMII is <a href="https://www.arnastofnun.is/is/stofnunin/starfsfolk/kristin-bjarnadottir" rel="nofollow">Kristín Bjarnadóttir</a>. <small><a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="nofollow">CC BY-SA 4.0</a></small></div>


${did_you_mean_in_footer ? did_you_mean_in_footer : ''}

<div class="contact">
<a href="https://ylhyra.is/Project:Inflections" class="gray name"><b>Ylhýra</b></a> •
<a href="mailto:ylhyra@ylhyra.is">Report errors</a> •
<a href="https://github.com/ylhyra/icelandic-inflections#readme">API</a>
</div>

</footer>

<script type="text/javascript">
document.getElementById("s").select();
</script>

${id ? `
<script type="text/javascript">
var el = document.getElementById("content");
el & el.scrollIntoView();
</script>`:`
`}

${/*Only list on main page */''}
${!title ? `
<script type="application/ld+json">
{
  "@context": "http://schema.org",
  "@type": "WebSite",
  "url": "https://inflections.ylhyra.is/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://inflections.ylhyra.is/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>`:''}
</body>
</html>
`


/* <link rel="canonical" href="https://example.com/dresses/green-dresses" /> */
