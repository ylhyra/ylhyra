import { editPage } from "Editor/actions";

export default () => {
  if (mw.util.getParamValue("action") !== "edit") return;
  if (mw.config.get("wgPageContentModel") !== "wikitext") return;
  if (!document.getElementById("wpTextbox1")) return;
  if (![0, 2, 3004].includes(mw.config.get("wgNamespaceNumber"))) return; // Mainspace and snippetspace
  var txt = document.editform.wpTextbox1;
  var value = txt.value;
  // if (!value.match(/({{|`)/)) return;
  if (mw.util.getParamValue("section")) return;
  if (value.match(/<!-- No start -->/)) return;
  if (value.match(/{{start\|/)) {
    value = value.replace(/{{start\|.+?}}/, `{{start|{{subst:FULLPAGENAME}}}}`);
  } else {
    // if (!value.match(/{{/)) return;
    value = `{{start|{{subst:FULLPAGENAME}}}}\n${value}\n{{end}}`;
  }
  txt.value = value;
};

window.createIncomingRedirects = (...array) => {
  array.forEach((title) => {
    editPage({
      title: title,
      text: `#REDIRECT[[${mw.config.get("wgPageName")}]]`,
    });
  });
};

//
// $('a.new ').each(function () {
//   $(this).replaceWith(function () {
//     return $("<span/>", { html: $(this).html() });
//   });
// })
