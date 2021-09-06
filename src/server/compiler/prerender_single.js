import React from "react";
// import Render from 'frontend/Render'
import ReactDOMServer from "react-dom/server";
import { build_folder } from "server/paths_backend";
import generate_html from "documents/compile";
import Parse from "documents/parse";
import { Provider } from "react-redux";
import store from "app/app/store";
import Router from "app/router";
import hash from "app/app/functions/hash";

var fs = require("fs");
const path = require("path");
const critical = require("critical");
let TESTING = false;

const html = fs.readFileSync(
  path.resolve(__basedir, `./public/index.html`),
  "utf8"
);

const fileHash = (file) => {
  return hash(fs.readFileSync(file, "utf8"));
};
const css_hash = fileHash(path.resolve(build_folder, `./app/main.css`));
const js_hash = fileHash(path.resolve(build_folder, `./app/ylhyra.main.js`));
const voc_hash = fileHash(
  path.resolve(build_folder, `./vocabulary/vocabulary_database.json`)
);

/*

  To test, run
  export ONLY=page_name; npm run prerender_single

*/
const render = async ({
  title,
  filename,
  css,
  is_content,
  shouldBeIndexed,
  callback,
}) => {
  const header_links = `
    <meta name="vocabulary_id" content="${voc_hash}"/>
    <link href="/app/main.css?v=${css_hash}" rel="stylesheet" />
  `;
  let footer_links = `
    ${
      TESTING
        ? `
      <script src="http://localhost:3000/static/js/bundle.js"></script>
      <script src="http://localhost:3000/static/js/vendors~main.chunk.js"></script>
      <script src="http://localhost:3000/static/js/main.chunk.js"></script>
    `
        : `<script src="/app/ylhyra.main.js?v=${js_hash}"></script>`
    }
  `;

  let content, header, necessary_data, output, props;
  if (is_content) {
    const h = await generate_html(title);
    content = h.content;
    header = h.header;
    const out = await Parse({ html: content });
    const { parsed, flattenedData } = out;
    props = { prerender: parsed };
    necessary_data = JSON.stringify({
      parsed,
      flattenedData: {
        long_audio: flattenedData?.long_audio,
      },
      header,
      shouldBeIndexed,
    });
  } else {
    props = { url: title };
  }

  // store.dispatch({
  //   type: "ROUTE",
  //   content: {
  //     pathname: URL_title(title),
  //   },
  // });

  output = ReactDOMServer.renderToStaticMarkup(
    <Provider store={store}>
      <Router {...props} />
    </Provider>
  );

  let footer_items =
    (necessary_data
      ? `<script type="text/javascript">window.ylhyra_data=${necessary_data}</script>`
      : "") + footer_links;

  if (filename === "not-found") {
    footer_items =
      '<script type="text/javascript">window.is404=true</script>' +
      footer_items;
  }

  output = html
    .replace("<title>", "<title>" + (header?.title ? header.title + " • " : ""))
    .replace(
      "<!-- Header items -->",
      "<!--TEMP-->" + header_links + "<!--TEMP-->"
    )
    .replace("<!-- Content -->", output || "")
    .replace("<!-- Footer items -->", footer_items + "<!-- Remaining CSS -->");

  if (shouldBeIndexed) {
    html.replace(
      /<meta name="robots" content="noindex" \/>/,
      '<meta name="robots" content="noindex">'
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
            /<!--TEMP-->[\s\S]+<!--TEMP-->/,
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
