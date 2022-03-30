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
const child_process_1 = require("child_process");
const transclude_1 = __importDefault(require("documents/compile/transclude"));
const fs_1 = __importDefault(require("fs"));
const loadLinks_1 = require("server/content/loadLinks");
const paths_backend_1 = require("server/paths_backend");
const underscore_1 = __importDefault(require("underscore"));
const Images = (data) => {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        let input = [];
        let output = [];
        let r = /<Image (.+)?\/>/g;
        if (!r.test(data)) {
            return resolve(data);
        }
        /* Collect params */
        data = data.replace(r, (params) => {
            input.push(params);
            return params;
        });
        // console.log({ filename });
        /* Run */
        yield (0, array_foreach_async_1.default)(input, (z) => __awaiter(void 0, void 0, void 0, function* () {
            yield new Promise((resolve2, reject2) => __awaiter(void 0, void 0, void 0, function* () {
                let [, filename_, rest] = z.match(/src="(.+?)"(.+)?\/>/);
                if (!/(png|jpe?g)$/i.test(filename_)) {
                    console.log(filename_ + " file type not yet supported");
                    output.push("");
                    // output.push(`<img src=""/>`)
                    return resolve2();
                }
                // console.log(rest)
                if (!((0, paths_1.URL_title)("File:" + filename_) in loadLinks_1.links)) {
                    throw new Error("No file named: " + filename_ + ". Is it from Commons?");
                    reject2();
                    return;
                }
                const file = loadLinks_1.links[(0, paths_1.URL_title)("File:" + filename_)].filepath.replace(/\.md$/, "");
                const filename = loadLinks_1.links[(0, paths_1.URL_title)("File:" + filename_)].filename;
                const [, name, ending] = filename.match(/(.+)\.(.+?)$/);
                (0, child_process_1.exec)(`identify ${file}`, (error, stdout) => __awaiter(void 0, void 0, void 0, function* () {
                    if (error)
                        return console.error(`exec error: ${error}`);
                    const [, original_width, original_height] = stdout.match(/^[^ ]+ [^ ]+ ([0-9]+)x([0-9]+)/);
                    let string_sizes = [];
                    let boxes = [800, 600, 400, 200].map((i) => {
                        // i = Math.max
                        if (original_width > original_height) {
                            return [
                                i,
                                Math.round((i * original_height) / original_width),
                                i * 2,
                                Math.round((i * 2 * original_height) / original_width),
                            ];
                        }
                        else {
                            return [
                                Math.round((i * original_width) / original_height),
                                i,
                                Math.round((i * 2 * original_width) / original_height),
                                i * 2,
                            ];
                        }
                    });
                    boxes.forEach((i) => {
                        string_sizes.push(`${i[0]}x${i[1]}`);
                        string_sizes.push(`${i[2]}x${i[3]}`);
                    });
                    string_sizes = underscore_1.default.uniq(string_sizes);
                    // ${rest}
                    let params = {};
                    rest &&
                        rest.replace(/([a-z]+)="(.+?)"/g, (v, key, val) => {
                            params[key] = val;
                        });
                    let transcluded = (yield (0, transclude_1.default)("File:" + filename_)).output;
                    const big_to_small = [...boxes];
                    const small_to_big = [...boxes].reverse();
                    // console.log(params);
                    output.push(`<Image position="${params.position || ""}" style="${params.width &&
                        !(params.position === "right" && params.width > 250)
                        ? `max-width:${params.width}px`
                        : ""}">
            <div class="image-and-metadata" data-translate="no">
              <picture>
                ${small_to_big
                        .map((i) => `
                  <source
                    ${i[0] !== 800 ? `media="(max-width: ${i[0]}px)"` : ""}
                    srcset="
                      ${paths_1.processed_image_url}/${name}-${i[0]}x${i[1]}.${ending} 1x,
                      ${paths_1.processed_image_url}/${name}-${i[2]}x${i[3]}.${ending} 2x"
                  />
                `)
                        .join("")}
                <img
                  src="${paths_1.processed_image_url}/${name}-${big_to_small[0][0]}x${big_to_small[0][1]}.${ending}"
                  width="${original_width}"
                  height="${original_height}"
                />
              </picture>
              ${transcluded
                        ? `<div class="image-metadata">${transcluded}</div>`
                        : ""}
            </div>
            ${params.caption
                        ? `<div class="caption">${params.caption}</div>`
                        : ""}
          </Image>
          `
                        .replace(/^ +/gm, "")
                        .replace(/\n/g, " "));
                    fs_1.default.stat(`${paths_backend_1.image_output_folder}/${name}-${boxes[0][2]}x${boxes[0][3]}.${ending}`, function (err) {
                        if (err === null) {
                            // File exists
                            return resolve2();
                        }
                        else if (err.code === "ENOENT") {
                            // File does not exist
                            (0, child_process_1.exec)(string_sizes
                                .map((size) => `
                  convert ${file} -resize ${size} -quality 80 ${paths_backend_1.image_output_folder}/${name}-${size}.${ending}
                `)
                                .join(""), (error2) => {
                                if (error2)
                                    return console.error(`exec error: ${error2}`);
                                return resolve2();
                            });
                        }
                        else {
                            console.log(err.code);
                            reject2();
                        }
                    });
                }));
            }));
        }));
        // console.log(output)
        /* Insert */
        let u = 0;
        data = data.replace(r, () => {
            // input.push(params)
            // return `<Image src="/api/images/${output[u++]}"/>`
            return output[u++];
        });
        resolve(data);
    }));
};
exports.default = Images;
