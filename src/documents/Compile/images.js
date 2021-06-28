import { URL_title, image_output_folder } from "paths.js";
import { ParseHeaderAndBody } from "server/content";
import _ from "underscore";
import Transclude from "./transclude";
import { processed_image_url, output_folder } from "paths.js";
import forEachAsync from "app/App/functions/array-foreach-async";
let links = {};
try {
  links = require("build/links.js");
} catch (e) {}

var fs = require("fs");
const { exec } = require("child_process");

const Images = (data) => {
  return new Promise(async (resolve, reject) => {
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
    /* Run */
    await forEachAsync(input, async (z, index) => {
      await new Promise(async (resolve2, reject2) => {
        let [o, filename_, rest] = z.match(/src="(.+?)"(.+)?\/>/);
        if (!/(png|jpe?g)$/.test(filename_)) {
          console.log(filename_ + " file type not yet supported");
          output.push("");
          // output.push(`<img src=""/>`)
          return resolve2();
        }
        // console.log(rest)
        if (!(URL_title("File:" + filename_) in links)) {
          throw new Error(
            "No file named: " + filename_ + ". Is it from Commons?"
          );
          reject2();
          return;
        }
        const file = links[URL_title("File:" + filename_)].file.replace(
          /\.md$/,
          ""
        );
        const filename = links[URL_title("File:" + filename_)].filename;
        const [k, name, ending] = filename.match(/(.+)\.(.+?)$/);

        exec(`identify ${file}`, async (error, stdout, stderr) => {
          if (error) return console.error(`exec error: ${error}`);
          const [j, original_width, original_height] = stdout.match(
            /^[^ ]+ [^ ]+ ([0-9]+)x([0-9]+)/
          );

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
            } else {
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
          string_sizes = _.uniq(string_sizes);

          // ${rest}
          let params = {};
          rest &&
            rest.replace(/([a-z]+)="(.+?)"/g, (v, key, val) => {
              params[key] = val;
            });
          let transcluded = (await Transclude("File:" + filename_)).output;
          const big_to_small = [...boxes];
          const small_to_big = [...boxes].reverse();
          output.push(
            `<Image position="${params.position || ""}" style="${
              params.width ? `max-width:${params.width}px` : ""
            }">
            <div class="image-and-metadata">
              <picture>
                ${small_to_big
                  .map(
                    (i, index) => `
                  <source
                    ${i[0] !== 800 ? `media="(max-width: ${i[0]}px)"` : ""}
                    srcset="
                      ${processed_image_url}/${name}-${i[0]}x${
                      i[1]
                    }.${ending} 1x,
                      ${processed_image_url}/${name}-${i[2]}x${
                      i[3]
                    }.${ending} 2x"
                  />
                `
                  )
                  .join("")}
                <img
                  src="${processed_image_url}/${name}-${big_to_small[0][0]}x${
              big_to_small[0][1]
            }.${ending}"
                  width="${original_width}"
                  height="${original_height}"
                />
              </picture>
              ${
                transcluded
                  ? `<div class="image-metadata">${transcluded}</div>`
                  : ""
              }
            </div>
            ${
              params.caption
                ? `<div class="caption">${params.caption}</div>`
                : ""
            }
          </Image>
          `
              .replace(/^ +/gm, "")
              .replace(/\n/g, " ")
          );

          fs.stat(
            `${image_output_folder}/${name}-${boxes[0][2]}x${boxes[0][3]}.${ending}`,
            function (err, stat) {
              if (err == null) {
                // File exists
                return resolve2();
              } else if (err.code === "ENOENT") {
                // File does not exist
                exec(
                  string_sizes
                    .map(
                      (size) => `
                  convert ${file} -resize ${size} -quality 80 ${image_output_folder}/${name}-${size}.${ending}
                `
                    )
                    .join(""),
                  (error2, stdout2, stderr2) => {
                    if (error2) return console.error(`exec error: ${error2}`);
                    return resolve2();
                  }
                );
              } else {
                console.log(err.code);
                reject2();
              }
            }
          );
        });
      });
    });
    // console.log(output)
    /* Insert */
    let u = 0;
    data = data.replace(r, (params) => {
      // input.push(params)
      // return `<Image src="/api/images/${output[u++]}"/>`
      return output[u++];
    });

    resolve(data);
  });
};

export default Images;
