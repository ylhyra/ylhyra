import path from "path";
import {
  contentUrl,
  processed_image_url,
  unprocessed_image_url,
} from "./paths";

/* Folders */
export const content_folder = path.resolve(__basedir, "./../ylhyra_content");
export const build_folder = __basedir + "/build";
export const image_output_folder = build_folder + "/images";

export const ylhyra_content_files = content_folder + "/not_data/files";

export const get_unprocessed_image_url = (file) =>
  `${unprocessed_image_url}/${encodeURIComponent(file)}`;
