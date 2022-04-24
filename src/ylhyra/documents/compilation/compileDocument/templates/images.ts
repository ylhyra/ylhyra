import { exec } from "child_process";
import fs from "fs";
import { createDirectoryIfMissing } from "modules/createDirectoryIfMissing";
import forEachAsync from "modules/forEachAsync";
import _ from "underscore";
import Transclude from "ylhyra/documents/compilation/compileDocument/transclude";
import { formatUrl } from "ylhyra/documents/compilation/links/format/formatUrl";
import { links } from "ylhyra/documents/compilation/links/loadLinks.server";
import { imageOutputFolder } from "ylhyra/server/paths_directories";
import { processedImageUrl } from "ylhyra/server/paths_urls";

export type ImageElementParameters = {
  width?: number;
  height?: number;
  caption?: string;
  position?: "right";
};

/**
 * Converts <Image/> tags into <img/> and creates multiple image sizes
 */
const Images = (data: string): Promise<string> => {
  return new Promise(async (resolve) => {
    let input: string[] = [];
    let output: string[] = [];
    let imageElementRegex = /<Image (.+)?\/>/g;
    if (!imageElementRegex.test(data)) {
      return resolve(data);
    }

    /* Collect params */
    data = data.replace(imageElementRegex, (params) => {
      input.push(params);
      return params;
    });

    /* Run */
    await forEachAsync(input, async (z) => {
      await new Promise<void>(async (resolve2, reject2) => {
        let [, _filename, rest] = z.match(/src="(.+?)"(.+)?\/>/);
        if (!/(png|jpe?g)$/i.test(_filename)) {
          console.log(_filename + " file type not yet supported");
          output.push("");
          return resolve2();
        }
        if (!(formatUrl("File:" + _filename) in links)) {
          throw new Error(
            "No file named: " + _filename + ". Is it from Commons?"
          );
        }
        const file = links[formatUrl("File:" + _filename)].filepath.replace(
          /\.md$/,
          ""
        );
        const filename = links[formatUrl("File:" + _filename)].filename;
        // @ts-ignore
        const [, name, ending] = filename.match(/(.+)\.(.+?)$/);

        exec(`identify ${file}`, async (error, stdout) => {
          if (error) return console.error(`exec error: ${error}`);
          const q = stdout.match(/^[^ ]+ [^ ]+ ([0-9]+)x([0-9]+)/) as string[];
          let originalWidth = parseInt(q[1]);
          let originalHeight = parseInt(q[2]);

          let sizesAsHeightXWidth: string[] = [];
          let boxes = [800, 600, 400, 200].map((i) => {
            // i = Math.max
            if (originalWidth > originalHeight) {
              return [
                i,
                Math.round((i * originalHeight) / originalWidth),
                i * 2,
                Math.round((i * 2 * originalHeight) / originalWidth),
              ];
            } else {
              return [
                Math.round((i * originalWidth) / originalHeight),
                i,
                Math.round((i * 2 * originalWidth) / originalHeight),
                i * 2,
              ];
            }
          });
          boxes.forEach((i) => {
            sizesAsHeightXWidth.push(`${i[0]}x${i[1]}`);
            sizesAsHeightXWidth.push(`${i[2]}x${i[3]}`);
          });
          sizesAsHeightXWidth = _.uniq(sizesAsHeightXWidth);

          let elementParameters: ImageElementParameters = {};
          rest &&
            rest.replace(
              /([a-z]+)="(.+?)"/g,
              (v: string, key: string, val: string) => {
                // @ts-ignore
                elementParameters[key] = val;
              }
            );
          let transcluded = (await Transclude("File:" + _filename)).output;
          const bigToSmall = [...boxes];
          const smallToBig = [...boxes].reverse();
          // console.log(params);
          output.push(
            `<Image position="${elementParameters.position || ""}" style="${
              elementParameters.width &&
              !(
                elementParameters.position === "right" &&
                elementParameters.width > 250
              )
                ? `max-width:${elementParameters.width}px`
                : ""
            }">
            <div class="image-and-metadata" data-translate="no">
              <picture>
                ${smallToBig
                  .map(
                    (i) => `
                  <source
                    ${i[0] !== 800 ? `media="(max-width: ${i[0]}px)"` : ""}
                    srcset="
                      ${processedImageUrl}/${name}-${i[0]}x${i[1]}.${ending} 1x,
                      ${processedImageUrl}/${name}-${i[2]}x${i[3]}.${ending} 2x"
                  />
                `
                  )
                  .join("")}
                <img
                  src="${processedImageUrl}/${name}-${bigToSmall[0][0]}x${
              bigToSmall[0][1]
            }.${ending}"
                  width="${originalWidth}"
                  height="${originalHeight}"
                  alt=""
                />
              </picture>
              ${
                transcluded
                  ? `<div class="image-metadata">${transcluded}</div>`
                  : ""
              }
            </div>
            ${
              elementParameters.caption
                ? `<div class="caption">${elementParameters.caption}</div>`
                : ""
            }
          </Image>
          `
              .replace(/^ +/gm, "")
              .replace(/\n/g, " ")
          );

          /**
           * Resize image using ImageMagick's `convert`.
           */
          createDirectoryIfMissing(imageOutputFolder);
          fs.stat(
            `${imageOutputFolder}/${name}-${boxes[0][2]}x${boxes[0][3]}.${ending}`,
            function (err) {
              if (err === null) {
                /* File exists */
                return resolve2();
              } else if (err.code === "ENOENT") {
                /* File does not exist */
                exec(
                  sizesAsHeightXWidth
                    .map(
                      (size) => `
                  convert ${file} -resize ${size} -quality 80 ${imageOutputFolder}/${name}-${size}.${ending}
                `
                    )
                    .join(""),
                  (error2) => {
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

    /* Replace image elements with what we've calculated  */
    let u = 0;
    data = data.replace(imageElementRegex, () => {
      return output[u++];
    });

    resolve(data);
  });
};

export default Images;
