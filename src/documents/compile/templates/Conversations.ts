import { json2html } from "app/app/functions/html2json";
import { HtmlAsJson } from "app/app/functions/html2json/types";
import c from "app/app/functions/no-undefined-in-template-literal";
import markdown_to_html from "documents/compile/markdown_to_html";

export default (json: HtmlAsJson): HtmlAsJson => {
  let text = json2html(json);
  let output = "";
  text.replace(
    /^(me|you): (.+)$/gm,
    (x: string, speaker: string, message: string) => {
      output += c`
        <div class="${speaker}">
          <div class="bubble-container">
            <div class="bubble">${message}</div>
          </div>
        </div>
      `;
      return "";
    }
  );
  output = c`
    <div class="card">
      <div class="conversation">
        <div class="conversationWindow">
          ${output}
        </div>
      </div>
    </div>
  `;

  output = output.replace(/^ +/gm, "").replace(/\n/g, "");

  return {
    node: "text",
    text: markdown_to_html(output),
  };
};
