import c from "app/App/functions/no-undefined-in-template-literal.js";
export default (input, header) => {
  const h = c`<div class="content-header">
    ${header.level && `<level level="${header.level}"/>`}
    ${
      header.has_data &&
      `<small class="gray">Click on words to see their translations.</small>`
    }
  </div>`;

  const f = c`<div class="content-footer">
    ${
      header.license === "CC0" &&
      `<div class="license">You are free to republish this article. <a href="https://creativecommons.org/publicdomain/zero/1.0/" class="license-link" rel="noopener">CC0 / Public Domain</a></div>`
    }
    ${header.published && `Published ${header.published}`}
  </div>`;

  return h + input + f;
};
