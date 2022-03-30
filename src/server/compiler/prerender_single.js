"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const paths_1 = require("app/app/paths");
const store_1 = __importDefault(require("app/app/store"));
const router_1 = __importDefault(require("app/router"));
const compile_1 = __importDefault(require("documents/compile"));
const parse_1 = __importDefault(require("documents/parse"));
const server_1 = __importDefault(require("react-dom/server"));
const react_redux_1 = require("react-redux");
const renderTitle_1 = require("server/content/renderTitle");
const paths_backend_1 = require("server/paths_backend");
const path = require("path");
const critical = require("critical");
var fs = require("fs");
let TESTING = false;
const html = fs.readFileSync(path.resolve(__basedir, `./src/app/app/public/index.html`), "utf8");
/*

  To test, run
  export ONLY=page_name; npm run prerender_single

*/
const render = ({ url, filename, css, is_content, shouldBeIndexed, callback, }) => __awaiter(void 0, void 0, void 0, function* () {
    const header_links = `
    <meta name="vocabulary_id" content=""/>
    <link href="/app/main.css" rel="stylesheet" />
    <link rel="canonical" href="https://ylhyra.is${encodeURI(url)}" />
  `;
    let footer_links = `
    ${TESTING
        ? `
      <script src="http://localhost:3000/static/js/bundle.js"></script>
      <script src="http://localhost:3000/static/js/vendors~main.chunk.js"></script>
      <script src="http://localhost:3000/static/js/main.chunk.js"></script>
    `
        : `<script src="/app/ylhyra.main.js"></script>`}
  `;
    let content, header, necessary_data, output, props;
    if (is_content) {
        const h = yield (0, compile_1.default)(url);
        content = h.content;
        header = h.header;
        const out = yield (0, parse_1.default)({ html: content });
        const { parsed, flattenedData } = out;
        props = { prerender: parsed };
        necessary_data = JSON.stringify({
            url,
            parsed,
            flattenedData: {
                long_audio: flattenedData === null || flattenedData === void 0 ? void 0 : flattenedData.long_audio,
            },
            header,
            shouldBeIndexed,
        });
    }
    else {
        props = { url: url };
    }
    store_1.default.dispatch({
        type: "ROUTE",
        content: {
            pathname: (0, paths_1.URL_title)(url),
        },
    });
    output = server_1.default.renderToStaticMarkup((0, jsx_runtime_1.jsx)(react_redux_1.Provider, Object.assign({ store: store_1.default }, { children: (0, jsx_runtime_1.jsx)(router_1.default, Object.assign({}, props)) })));
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
    let footer_items = (necessary_data
        ? `<script type="text/javascript">window.ylhyra_data=${necessary_data}</script>`
        : "") + footer_links;
    // console.log(footer_items);
    if (filename === "not-found") {
        footer_items =
            '<script type="text/javascript">window.is404=true</script>' +
                footer_items;
    }
    output = html
        .replace(/<title>(.+)<\/title>/, `<title>${(0, renderTitle_1.renderTitle)(header === null || header === void 0 ? void 0 : header.title)}</title>`)
        .replace("<!-- Header items -->", "<!--CSS-->" + header_links + "<!--CSS-->")
        .replace("<!-- Content -->", output || "")
        .replace(/<!-- Footer items -->[\s\S]+<!-- Footer items end -->/, footer_items + "<!-- Remaining CSS -->");
    if (shouldBeIndexed) {
        output = output.replace(/<meta name="robots" content="noindex" \/>/, '<meta name="robots" content="index">');
    }
    necessary_data &&
        fs.writeFileSync(path.resolve(paths_backend_1.build_folder, `./prerender/${filename}.json`), necessary_data);
    fs.writeFileSync(path.resolve(paths_backend_1.build_folder, `./prerender/${filename}.html`), output);
    if (false && css) {
        /* Inline CSS */
        critical.generate({
            base: paths_backend_1.build_folder,
            src: `prerender/${filename}.html`,
            width: 1300,
            height: 9000,
            inline: true,
        }, (err, cr_output /* Includes {css, html, uncritical} */) => {
            output = output
                .replace(/<!--CSS-->[\s\S]+<!--CSS-->/, "<style>" + cr_output.css + "</style>")
                .replace("<!-- Remaining CSS -->", header_links);
            if (err)
                console.log(err);
            fs.writeFileSync(path.resolve(paths_backend_1.build_folder, `./prerender/${filename}.html`), output);
            callback && callback();
        });
    }
    else {
        callback && callback();
    }
});
exports.default = render;
