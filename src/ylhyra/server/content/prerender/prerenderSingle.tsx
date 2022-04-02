import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import { URL_title } from "ylhyra/app/app/paths";
import store from "ylhyra/app/app/store";
import Router from "ylhyra/app/router";
import { PrerenderedDataSavedInPage } from "ylhyra/app/types";
import generateHtml from "ylhyra/documents/compile";
import Parse from "ylhyra/documents/parse";
import { renderTitle } from "ylhyra/server/content/renderTitle";
import { build_folder, getBaseDir } from "ylhyra/server/paths_backend";

let TESTING = false;

const html = fs.readFileSync(
  path.resolve(getBaseDir(), `./src/app/app/public/index.html`),
  "utf8"
);

/*

  To test, run
  export ONLY=page_name; npm run prerender_single

*/
const render = async ({
  url,
  filename,
  css,
  isContent,
  shouldBeIndexed,
  callback,
}) => {
  const header_links = `
    <meta name="vocabulary_id" content=""/>
    <link href="/app/main.css" rel="stylesheet" />
    <link rel="canonical" href="https://ylhyra.is${encodeURI(url)}" />
  `;

  let footerLinks = `
    ${
      TESTING
        ? `
      <script src="http://localhost:3000/static/js/bundle.js"></script>
      <script src="http://localhost:3000/static/js/vendors~main.chunk.js"></script>
      <script src="http://localhost:3000/static/js/main.chunk.js"></script>
    `
        : `<script src="/app/ylhyra.main.js"></script>`
    }
  `;

  let content, header, necessary_data, output, props;

  if (isContent) {
    const h = await generateHtml(url);
    content = h.content;
    header = h.header;
    const out = Parse({ html: content });
    const { parsed, flattenedData } = out;
    props = { prerender: parsed };
    if (parsed && header) {
      const dataToSave: PrerenderedDataSavedInPage = {
        url,
        parsed,
        flattenedData: {
          long_audio: flattenedData?.long_audio,
        },
        header,
        shouldBeIndexed,
      };
      necessary_data = JSON.stringify(dataToSave);
    }
  } else {
    props = { url: url };
  }

  store.dispatch({
    type: "ROUTE",
    content: {
      pathname: URL_title(url),
    },
  });

  output = ReactDOMServer.renderToStaticMarkup(
    <Provider store={store}>
      <Router {...props} />
    </Provider>
  );

  if (/({{|}})/.test(output) && !/blær/.test(url)) {
    console.error(`Unexpanded template in ${url}`);
    console.error(output.match(/(.{20}?({{|}}).{20}?)/)?.[1]);
  }
  if (/(\*)/.test(output)) {
    console.error(`Unparsed "*" in ${url}`);
    console.error(output.match(/(.{20}?(\*).{20}?)/)?.[1]);
  }

  if (/<h1([^\n]{40,)<\/h1>/.test(output)) {
    console.error(`Very long heading in ${url}`);
  }

  let footer_items =
    (necessary_data
      ? `<script type="text/javascript">window.ylhyra_data=${necessary_data}</script>`
      : "") + footerLinks;

  if (filename === "not-found") {
    footer_items =
      '<script type="text/javascript">window.is404=true</script>' +
      footer_items;
  }

  output = html
    .replace(
      /<title>(.+)<\/title>/,
      `<title>${renderTitle(header?.title)}</title>`
    )
    .replace(
      "<!-- Header items -->",
      "<!--CSS-->" + header_links + "<!--CSS-->"
    )
    .replace("<!-- Content -->", output || "")
    .replace(
      /<!-- Footer items -->[\s\S]+<!-- Footer items end -->/,
      footer_items + "<!-- Remaining CSS -->"
    );

  if (shouldBeIndexed) {
    output = output.replace(
      /<meta name="robots" content="noindex" \/>/,
      '<meta name="robots" content="index">'
    );
  }

  necessary_data &&
    fs.writeFileSync(
      path.resolve(build_folder, `./prerender/${filename}.json`),
      necessary_data
    );
  fs.writeFileSync(
    path.resolve(build_folder, `./prerender/${filename}.html`),
    output
  );
  if (false && css) {
  } else {
    callback && callback();
  }
};

export default render;

// import critical from "critical";
// const generateCriticalCss = () => {
//   /* Inline CSS */
//   critical.generate(
//     {
//       base: build_folder,
//       src: `prerender/${filename}.html`,
//       width: 1300,
//       height: 9000,
//       inline: true,
//     },
//     (err, cr_output /* Includes {css, html, uncritical} */) => {
//       output = output
//         .replace(
//           /<!--CSS-->[\s\S]+<!--CSS-->/,
//           "<style>" + cr_output.css + "</style>"
//         )
//         .replace("<!-- Remaining CSS -->", header_links);
//       if (err) console.log(err);
//       fs.writeFileSync(
//         path.resolve(build_folder, `./prerender/${filename}.html`),
//         output
//       );
//       callback && callback();
//     }
//   );
// }
