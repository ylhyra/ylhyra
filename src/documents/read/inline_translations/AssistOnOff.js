"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InlineTranslations_1 = require("documents/Read/InlineTranslations/InlineTranslations/");
/*
  We use a false checkbox since iOS doesn't behave well with inputs.
*/
window.assistOnOff = (element) => {
    /*
      Assist ON
    */
    if (!element.hasAttribute("data-checked")) {
        element.setAttribute("data-checked", true);
        element.closest(".container").removeAttribute("no-assist");
        element.closest(".container").setAttribute("assist", "true");
        (0, InlineTranslations_1.fix_inline_translations)();
    }
    else {
        /*
        Assist OFF
      */
        element.removeAttribute("data-checked");
        element.closest(".container").removeAttribute("assist");
        element.closest(".container").setAttribute("no-assist", "true");
        const elements = document.querySelectorAll(`.inline_translation`);
        elements.forEach((e) => {
            const wordContainer = e.closest(`.word-container`);
            wordContainer.style.minWidth = "auto";
        });
    }
};
