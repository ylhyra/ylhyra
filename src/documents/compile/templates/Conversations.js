"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const html2json_1 = require("app/app/functions/html2json");
const no_undefined_in_template_literal_1 = __importDefault(require("app/app/functions/no-undefined-in-template-literal"));
const markdown_to_html_1 = __importDefault(require("documents/compile/markdown_to_html"));
exports.default = (json) => {
    let text = (0, html2json_1.json2html)(json);
    let output = "";
    text.replace(/^(me|you): (.+)$/gm, (x, speaker, message) => {
        output += (0, no_undefined_in_template_literal_1.default) `
      <div class="${speaker}">
        <div className="bubble-container">
          <div className="bubble">${message}</div>
        </div>
      </div>
    `;
    });
    output = (0, no_undefined_in_template_literal_1.default) `
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
        text: (0, markdown_to_html_1.default)(output),
    };
};
