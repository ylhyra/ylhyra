"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const no_undefined_in_template_literal_1 = __importDefault(require("app/app/functions/no-undefined-in-template-literal"));
exports.default = (input) => {
    return input === null || input === void 0 ? void 0 : input.replace(/{\| class="wikitable"([\s\S]+?)\|}/g, (x, content) => {
        return `<table class="wikitable">
    <tbody>
      ${content
            .split(/(?:^\|\+|^\|-)/gm)
            .map((v) => {
            return `<tr>
            ${(() => {
                const k = v.split(/^(\||!)/gm);
                return k
                    .map((d, index) => {
                    if (index === 0)
                        return "";
                    if (index % 2 !== 0)
                        return "";
                    const el = k[index - 1] === "!" ? "th" : "td";
                    const [, attributes, data] = d.match(/^(?:([^|[\]]+)\|)?([\S\s]+)$/);
                    return (0, no_undefined_in_template_literal_1.default) `<${el} ${attributes}>
                    ${data}
                  </${el}>`;
                })
                    .join("");
            })()}
          </tr>`;
        })
            .join("")}
    </tbody>

  </table>
  `;
    });
};
