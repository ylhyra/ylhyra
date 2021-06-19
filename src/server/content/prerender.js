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
const router = require("express").Router();
var now = require("performance-now");
var fs = require("fs");
const path = require("path");
const critical = require("critical");

const header_links = `
  <link href="/main.css" rel="stylesheet" />
  <script src="/ylhyra.js"></script>
`;
const css = fs.readFileSync(path.resolve(output_folder, `./css.css`), "utf8");
const html = fs.readFileSync(
  path.resolve(__basedir, `./public/index.html`),
  "utf8"
);

const render = async (title) => {
  const { content, header } = await generate_html(title);
  const out = await Parse({ html: content });
  const { parsed, tokenized, data, flattenedData } = out;
  // let output = ReactDOMServer.renderToStaticMarkup(Render({ json: parsed }));
  let output = ReactDOMServer.renderToStaticMarkup(
    <Provider store={store}>
      <Router prerender={parsed} />
    </Provider>
  );

  output += `<script type="text/javascript">window.ylhyra_data=${JSON.stringify(
    {
      parsedHTML: ReactDOMServer.renderToStaticMarkup(parsed),
      tokenized,
      data,
      flattenedData,
    }
  )}</script>`;

  output = html
    .replace("<!-- Title -->", header.title ? header.title + " - " : "")
    .replace("<!-- Header items -->", header_links)
    .replace("<!-- Content -->", output);

  fs.writeFileSync(path.resolve(output_folder, `./${title}.html`), output);

  /* Inline CSS */
  critical.generate(
    {
      base: output_folder,
      src: `${title}.html`,
      width: 1300,
      height: 9000,
      inline: true,
    },
    (err, cr_output /* Includes {css, html, uncritical} */) => {
      if (err) console.log(err);
      fs.writeFileSync(
        path.resolve(output_folder, `./${title}2.html`),
        cr_output.html
      );
      process.exit();
    }
  );
};

render("lúpína");
