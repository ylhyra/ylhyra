import { html2json, json2html } from "app/app/functions/html2json";
import { TokenizedParagraphWithIds } from "documents/parse/types";
import { HtmlAsJson } from "app/app/functions/html2json/types";
import { TEMPORARY_SPLIT_MARKER } from "documents/parse/WrapInTags/1-InsertSplit";

/*
  STEP 2:

  Then we split on the "{{SPLIT HERE}}"
  and then we open and close HTML tags as necessary.
*/

export default function (
  html: string,
  tokenizedSplit:
    | TokenizedParagraphWithIds["sentences"]
    | TokenizedParagraphWithIds["sentences"][number]["words"],
  elementName: "sentence" | "word",
  innerFunction: Function | undefined,
  temp_attribute_name: string
): HtmlAsJson {
  let count = 0;
  let openTags: string[] = [];
  html = html
    .split(TEMPORARY_SPLIT_MARKER)
    .map((part, index) => {
      let returns = "";
      /*
        Reopen all open tags since we're starting a new string
      */
      openTags.forEach((e) => {
        returns += e;
      });

      /*
        Go look for tags
      */
      returns += part
        .split(/(<[^>]*>)/g)
        .map((b) => {
          if (/(<[^>]*>)/g.test(b)) {
            /*
              Tag opens
            */
            if (!b.startsWith("</") && !b.endsWith("/>")) {
              const tagWithId = b.replace(
                />$/,
                ` ${temp_attribute_name}="${count++}">`
              );
              openTags.push(tagWithId);
              return tagWithId;
            } else if (b.startsWith("</")) {
              /*
                Tag closes
              */
              openTags = openTags.slice(0, openTags.length - 1);
              return b;
            }
          }
          return b;
        })
        .join("");

      /*
        Close all open tags
      */
      openTags
        .slice()
        .reverse()
        .forEach((e) => {
          returns += `</${e.match(/<([^ ]+)/)?.[1]}>`;
        });

      const id =
        typeof tokenizedSplit[index] !== "string" && tokenizedSplit[index].id;

      /*
        Empty data, punctuation, or empty tags
      */
      // if (!/[A-zÀ-ÿ0-9]/.test(returns.replace(/(<[^>]*>)/g, ''))) {
      //   return returns;
      // }
      if (!id) {
        return returns;
      }

      /*
        Do we send this data deeper?
        [This is done by sentences() to send its children into words()]
      */
      if (innerFunction) {
        returns = json2html(innerFunction(html2json(returns).child, id));
      }

      /*
        Surrounding spaces will not be inside the tag
      */
      if (!returns) {
        returns = "";
      }

      // Move spaces to around any tags (shows up if surrounded by <em/> tags)
      returns = returns.replace(/(<[^<>/]+>) /g, " $1");
      returns = returns.replace(/ (<\/[^<>/]+>)/g, "$1 ");

      // Takes the surrounding spaces
      const r = returns.match(/^( +)?(.*?)( +)?$/);

      const spaceAtBeginning = r?.[1] || "";
      const content = r?.[2] || "";
      const spaceAtEnd = r?.[3] || "";

      /*
        Wrap in <sentence/> and <word/> tags
      */
      return (
        spaceAtBeginning +
        `<${elementName} id="${id}" data-${elementName}-id="${id}">` +
        content +
        `</${elementName}>` +
        spaceAtEnd
      );
    })
    .join("");
  return html2json(html);
}
