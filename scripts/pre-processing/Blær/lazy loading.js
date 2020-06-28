
var txt = document.editform.wpTextbox1
var value = txt.value
txt.value = value.replace(/<img /g,'<img loading="lazy"')
