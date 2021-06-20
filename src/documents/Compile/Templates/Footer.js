import c from "app/App/functions/no-undefined-in-template-literal.js";
export default (header) => {
  return c`<div class="content-footer">
    ${
      header.license === "CC0" &&
      `<div class="license">You are free to republish this article. <a href="https://creativecommons.org/publicdomain/zero/1.0/" class="license-link" rel="noopener">CC0 / Public Domain</a></div>`
    }
    ${header.published && `Published ${header.published}`}
  </div>`;
};
