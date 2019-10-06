export default () => {
  if (mw.util.getParamValue('action') !== 'edit') return;
  if (!document.getElementById('wpTextbox1')) return;
  if (![0, 3004].includes(mw.config.get('wgNamespaceNumber'))) return; // Mainspace and snippetspace
  var txt = document.editform.wpTextbox1
  var value = txt.value
  if (value.match(/{{start\|/)) return;
  if (!value.match(/{{/)) return;
  value = `{{start|{{subst:FULLPAGENAME}}}}\n\n${value}\n\n{{end}}`
  txt.value = value
}
