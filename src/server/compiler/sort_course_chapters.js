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
Object.defineProperty(exports, "__esModule", { value: true });
/*
npm run chapters
*/
// import urlSlug from 'src/app/App/functions/url-slug'
//
const getOrderOfChapters_1 = require("documents/compile/templates/getOrderOfChapters");
const links_1 = require("server/content/links");
const paths_backend_1 = require("server/paths_backend");
var fs = require("fs");
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield (0, getOrderOfChapters_1.getOrder)(true);
    // console.log(order);
    order.forEach((item) => {
        let { filepath } = (0, links_1.getValuesForURL)(item.url);
        const filename = filepath.replace(/^.+\//, "").replace(/^\d+-(\d+-)?/, "");
        // const tmpFile =
        // content_folder + `/not_data/content/course/unused/${prefixZeroes(item.unit)}`;
        // rename(file, )
        const dir = //content_folder + `/not_data/content/course/A1`;
         paths_backend_1.content_folder + `/not_data/content/course/A1/${prefixZeroes(item.unit)}`;
        rename(filepath, dir + `/${prefixZeroes(item.prefix, 2)}-${filename}`);
    });
    process.exit();
});
run();
const rename = (from, to) => {
    const dir = to.replace(/^(.+)\/(.+)/, "$1");
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.renameSync(from, to);
};
const prefixZeroes = (input, min = 2) => {
    return ("00" + input.toString()).slice(-Math.max(min, input.toString().length));
};
