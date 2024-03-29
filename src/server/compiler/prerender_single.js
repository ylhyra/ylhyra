import React from "react";
import ReactDOMServer from "react-dom/server";
import { build_folder } from "server/paths_backend";
import generate_html from "documents/compile";
import Parse from "documents/parse";
import { Provider } from "react-redux";
import store from "app/app/store";
import Router from "app/router";
import { renderTitle } from "server/content/renderTitle";
import { URL_title } from "app/app/paths";

const path = require("path");

const critical = require("critical");

var fs = require("fs");

let TESTING = false;

const html = fs.readFileSync(
  path.resolve(__basedir, `./src/app/app/public/index.html`),
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
  is_content,
  shouldBeIndexed,
  callback,
}) => {
  const header_links = `
    <meta name="vocabulary_id" content=""/>
    <link href="/app/main.css" rel="stylesheet" />
    <link rel="canonical" href="https://ylhyra.is${encodeURI(url)}" />
  `;

  let footer_links = `
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
  if (is_content) {
    const h = await generate_html(url);
    content = h.content;
    header = h.header;
    const out = await Parse({ html: content });
    const { parsed, flattenedData } = out;
    props = { prerender: parsed };
    necessary_data = JSON.stringify({
      url,
      parsed,
      flattenedData: {
        long_audio: flattenedData?.long_audio,
      },
      header,
      shouldBeIndexed,
    });
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
    console.error(output.match(/(.{20}?({{|}}).{20}?)/)[1]);
  }
  if (/(\*)/.test(output)) {
    console.error(`Unparsed "*" in ${url}`);
    console.error(output.match(/(.{20}?(\*).{20}?)/)[1]);
  }

  if (/<h1([^\n]{40,)<\/h1>/.test(output)) {
    console.error(`Very long heading in ${url}`);
  }

  let footer_items =
    (necessary_data
      ? `<script type="text/javascript">window.ylhyra_data=${necessary_data}</script>`
      : "") + footer_links;

  // console.log(footer_items);

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
    /* Inline CSS */
    critical.generate(
      {
        base: build_folder,
        src: `prerender/${filename}.html`,
        width: 1300,
        height: 9000,
        inline: true,
      },
      (err, cr_output /* Includes {css, html, uncritical} */) => {
        output = output
          .replace(
            /<!--CSS-->[\s\S]+<!--CSS-->/,
            "<style>" + cr_output.css + "</style>"
          )
          .replace("<!-- Remaining CSS -->", header_links);
        if (err) console.log(err);
        fs.writeFileSync(
          path.resolve(build_folder, `./prerender/${filename}.html`),
          output
        );
        callback && callback();
      }
    );
  } else {
    callback && callback();
  }
};

export default render;
