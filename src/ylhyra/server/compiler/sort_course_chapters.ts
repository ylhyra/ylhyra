/*
npm run chapters
*/
// import urlSlug from 'src/app/App/functions/url-slug'
//
import { getOrderOfChapters } from "ylhyra/documents/compile/templates/getOrderOfChapters";
import { getValuesForURL } from "ylhyra/server/content/links";
import { content_folder } from "ylhyra/server/paths_backend";

var fs = require("fs");

const run = async () => {
  const order = await getOrderOfChapters(true);
  // console.log(order);
  order.forEach((item) => {
    let { filepath } = getValuesForURL(item.url);
    const filename = filepath.replace(/^.+\//, "").replace(/^\d+-(\d+-)?/, "");

    // const tmpFile =
    // content_folder + `/not_data/content/course/unused/${prefixZeroes(item.unit)}`;
    // rename(file, )

    const dir = //content_folder + `/not_data/content/course/A1`;
      content_folder + `/not_data/content/course/A1/${prefixZeroes(item.unit)}`;
    rename(filepath, dir + `/${prefixZeroes(item.prefix, 2)}-${filename}`);
  });
  process.exit();
};
run();

const rename = (from, to) => {
  const dir = to.replace(/^(.+)\/(.+)/, "$1");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.renameSync(from, to);
};

const prefixZeroes = (input, min = 2) => {
  return ("00" + input.toString()).slice(
    -Math.max(min, input.toString().length)
  );
};
