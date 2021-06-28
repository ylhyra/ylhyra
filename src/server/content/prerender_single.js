import React from "react";
// import Render from 'frontend/Render'
import ReactDOMServer from "react-dom/server";
import { content_folder, output_folder, URL_title } from "paths.js";
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

const css = fs.readFileSync(
  path.resolve(output_folder, `./app/main.css`),
  "utf8"
);
const html = fs.readFileSync(
  path.resolve(__basedir, `./public/index.html`),
  "utf8"
);

const render = async (title, filename, css, callback) => {
  // console.log(title);
  const { content, header } = await generate_html(title);
  const out = await Parse({ html: content });
  const { parsed, tokenized, data, flattenedData } = out;
  let output = ReactDOMServer.renderToStaticMarkup(
    <Provider store={store}>
      <Router prerender={parsed} />
    </Provider>
  );

  const necessary_data = JSON.stringify({
    parsed,
    flattenedData: {
      long_audio: flattenedData && flattenedData.long_audio,
    },
  });

  const footer_items =
    `<script type="text/javascript">window.ylhyra_data=${necessary_data}</script>` +
    footer_links;

  output = html
    .replace("<title>", "<title>" + (header.title ? header.title + " • " : ""))
    .replace(
      "<!-- Header items -->",
      "<!--TEMP-->" + header_links + "<!--TEMP-->"
    )
    .replace("<!-- Content -->", output)
    .replace("<!-- Footer items -->", footer_items + "<!-- Remaining CSS -->");

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
        callback();
      }
    );
  } else {
    callback();
  }
};

export default render;
