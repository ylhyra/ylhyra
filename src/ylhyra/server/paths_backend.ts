import path from "path";
import { unprocessedImageUrl } from "ylhyra/server/content/links/paths";

export const getBaseDir = () => process.env.PWD as string;

/* Folders */
export const content_folder = path.resolve(getBaseDir(), "./../ylhyra_content");
export const build_folder = getBaseDir() + "/build";
export const image_output_folder = build_folder + "/images";

export const ylhyra_content_files = content_folder + "/not_data/files";

export const get_unprocessed_image_url = (file: string) =>
  `${unprocessedImageUrl}/${encodeURIComponent(file)}`;
