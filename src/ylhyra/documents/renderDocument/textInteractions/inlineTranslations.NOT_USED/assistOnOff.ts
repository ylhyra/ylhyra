// import { fix_inline_translations } from "ylhyra/documents/read/inline_translations/AssistOnOff";
//
// /*
//   We use a false checkbox since iOS doesn't behave well with inputs.
// */
// window.assistOnOff = (element) => {
//   /*
//     Assist ON
//   */
//   if (!element.hasAttribute("data-checked")) {
//     element.setAttribute("data-checked", true);
//     element.closest(".container").removeAttribute("no-assist");
//     element.closest(".container").setAttribute("assist", "true");
//     fix_inline_translations();
//   } else {
//     /*
//     Assist OFF
//   */
//     element.removeAttribute("data-checked");
//     element.closest(".container").removeAttribute("assist");
//     element.closest(".container").setAttribute("no-assist", "true");
//     const elements = document.querySelectorAll(`.inline_translation`);
//     elements.forEach((e) => {
//       const wordContainer = e.closest(`.word-container`);
//       wordContainer.style.minWidth = "auto";
//     });
//   }
// };
