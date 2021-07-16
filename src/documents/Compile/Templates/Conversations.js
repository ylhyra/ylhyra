import { html2json, json2html } from "app/App/functions/html2json";
import c from "app/App/functions/no-undefined-in-template-literal";
import markdown_to_html from "documents/Compile/markdown_to_html";

export default (json) => {
  let text = json2html(json);
  let output = "";
  text.replace(/^(me|you): (.+)$/gm, (x, speaker, message) => {
    output += c`
      <div class="${speaker}">
        <div className="bubble-container">
          <div className="bubble">${message}</div>
        </div>
      </div>
    `;
  });
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

  // console.log(output);
  return {
    node: "text",
    text: markdown_to_html(output),
  };
};
