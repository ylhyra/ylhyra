import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import store from "ylhyra/app/app/store";
import Router from "ylhyra/app/router";
import { PrerenderedDataSavedInPage } from "ylhyra/app/types";
import { compileDocument } from "ylhyra/documents/compilation/compileDocument";
import { compileWithTranslation } from "ylhyra/documents/compilation/compileWithTranslation";
import { formatUrl } from "ylhyra/documents/compilation/links/format/formatUrl";
import { renderTitle } from "ylhyra/documents/compilation/links/format/renderTitle";
import { buildFolder, getBaseDir } from "ylhyra/server/paths_directories";

let TESTING = false;

const html = fs.readFileSync(
  path.resolve(getBaseDir(), `./src/app/app/public/index.html`),
  "utf8"
);

/*

  To test, run
  export ONLY=page_name; npm run prerender_single

*/
export default async function prerender({
  url,
  filename,
  isContent,
  shouldBeIndexed,
  callback,
}: {
  url: string;
  filename: string;
  isContent: Boolean;
  shouldBeIndexed: Boolean;
  callback: Function;
}) {
  const headerLinks = `
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

  let content, header, necessaryData, output, props;

  if (isContent) {
    const h = await compileDocument(url);
    content = h.content;
    header = h.header;
    const out = compileWithTranslation({ html: content });
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
      necessaryData = JSON.stringify(dataToSave);
    }
  } else {
    props = { url: url };
  }

  store.dispatch({
    type: "ROUTE",
    content: {
      pathname: formatUrl(url),
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

  let footerItems =
    (necessaryData
      ? `<script type="text/javascript">window.ylhyra_data=${necessaryData}</script>`
      : "") + footerLinks;

  if (filename === "not-found") {
    footerItems =
      '<script type="text/javascript">window.is404=true</script>' + footerItems;
  }

  output = html
    .replace(
      /<title>(.+)<\/title>/,
      `<title>${renderTitle(header?.title)}</title>`
    )
    .replace("<!-- Header items -->", "<!--CSS-->" + headerLinks + "<!--CSS-->")
    .replace("<!-- Content -->", output || "")
    .replace(
      /<!-- Footer items -->[\s\S]+<!-- Footer items end -->/,
      footerItems + "<!-- Remaining CSS -->"
    );

  if (shouldBeIndexed) {
    output = output.replace(
      /<meta name="robots" content="noindex" \/>/,
      '<meta name="robots" content="index">'
    );
  }

  necessaryData &&
    fs.writeFileSync(
      path.resolve(buildFolder, `./prerender/${filename}.json`),
      necessaryData
    );
  fs.writeFileSync(
    path.resolve(buildFolder, `./prerender/${filename}.html`),
    output
  );
  callback && callback();
}
