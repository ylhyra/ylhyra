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
const array_foreach_async_1 = __importDefault(require("app/app/functions/array-foreach-async"));
const paths_1 = require("app/app/paths");
const appUrls_1 = require("app/router/appUrls");
const initializeDeckFromFile_1 = require("documents/compile/vocabulary/initializeDeckFromFile");
const prerender_single_1 = __importDefault(require("server/compiler/prerender_single"));
const loadLinks_1 = require("server/content/loadLinks");
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    process.stdout.write("Prerendering...");
    (0, initializeDeckFromFile_1.initializeDeckFromFile)();
    /* Render empty shell */
    let to_render = Object.keys(appUrls_1.app_urls);
    // console.log(url_to_info);
    Object.keys(loadLinks_1.links).forEach((url) => {
        if (!loadLinks_1.links[url].shouldBeCreated)
            return;
        to_render.push(url);
    });
    let i = 0;
    yield (0, array_foreach_async_1.default)(to_render, (url) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve2) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            /* Used for testing */
            if (process.env.ONLY && (0, paths_1.URL_title)(process.env.ONLY) !== url) {
                return resolve2();
            }
            // if (i < 200) {
            //   i++;
            //   resolve2();
            //   return;
            // }
            let filename;
            let is_content;
            if (loadLinks_1.links[url]) {
                filename = loadLinks_1.links[url].filename;
                is_content = true;
            }
            else {
                filename = (0, paths_1.FileSafeTitle)(url);
                is_content = false;
            }
            process.stdout.write("\r\x1b[K");
            process.stdout.write(`${i++} of ${to_render.length} done – ${url}`);
            (0, prerender_single_1.default)({
                url,
                filename,
                css: true,
                is_content,
                shouldBeIndexed: (_a = loadLinks_1.links[url]) === null || _a === void 0 ? void 0 : _a.shouldBeIndexed,
                callback: resolve2,
            });
        }));
    }));
    process.exit();
});
run();
