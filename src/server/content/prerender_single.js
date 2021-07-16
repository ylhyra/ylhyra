import React from "react";
// import Render from 'frontend/Render'
import ReactDOMServer from "react-dom/server";
import { URL_title } from "paths";
import { content_folder, output_folder } from "paths_backend";
import generate_html from "documents/Compile";
import Parse from "documents/Parse";
import { updateURL } from "app/Router/actions";
import Render from "documents/Render";
import { connect, Provider } from "react-redux";
import store from "app/App/store";
import Router from "app/Router";
import shortid from "shortid";
const router = require("express").Router();
var now = require("performance-now");
var fs = require("fs");
const path = require("path");
const critical = require("critical");
const build_folder = path.resolve(__basedir, `./build`);
let TESTING = false;
/* TODO */
let hash = shortid.generate();

const css = fs.readFileSync(
  path.resolve(output_folder, `./app/main.css`),
  "utf8"
);
const html = fs.readFileSync(
  path.resolve(__basedir, `./public/index.html`),
  "utf8"
);

const render = async ({ title, filename, css, is_content, callback }) => {
  const header_links = `
    <link href="/app/main.css?v=${hash}" rel="stylesheet" />
  `;
  let footer_links = `
    ${
      TESTING
        ? `
      <script src="http://localhost:3000/static/js/bundle.js"></script>
      <script src="http://localhost:3000/static/js/vendors~main.chunk.js"></script>
      <script src="http://localhost:3000/static/js/main.chunk.js"></script>
    `
        : `<script src="/app/ylhyra.main.js?v=${hash}"></script>`
    }
  `;

  let content, header, necessary_data, output, props;
  if (is_content) {
    const h = await generate_html(title);
    content = h.content;
    header = h.header;
    const out = await Parse({ html: content });
    const { parsed, tokenized, data, flattenedData } = out;
    props = { prerender: parsed };
    necessary_data = JSON.stringify({
      parsed,
      header,
      flattenedData: {
        long_audio: flattenedData && flattenedData.long_audio,
      },
    });
  } else {
    props = { url: title };
  }
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
    .replace(
      "<title>",
      "<title>" + (header && header.title ? header.title + " • " : "")
    )
    .replace(
      "<!-- Header items -->",
      "<!--TEMP-->" + header_links + "<!--TEMP-->"
    )
    .replace("<!-- Content -->", output || "")
    .replace("<!-- Footer items -->", footer_items + "<!-- Remaining CSS -->");

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

/* Testing */
// node build/server/development/ylhyra_server.development.js --prerender-single
if (process.argv[2] === "--prerender-single") {
  TESTING = true;
  render({
    title: "nokkrir",
    filename: "nokkrir",
    callback: process.exit,
    is_content: true,
  });
}
