import { Html } from "inflection/tables/types";

/**
 * A very simple Markdown -> HTML function for making bold and italic text.
 * Todo: Is this actually used a lot?
 */
export function ItalicsAndBold(input: string): Html {
  return input
    .replace(/\*\*([^ ].+?[^ ])\*\*/g, "<b>$1</b>")
    .replace(/\*([^ ].+?[^ ])\*/g, "<i>$1</i>")
    .replace(/_([^ ].+?[^ ])_/g, "<i>$1</i>");
}
