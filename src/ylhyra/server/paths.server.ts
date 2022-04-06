import path from "path";
import { unprocessedImageUrl } from "ylhyra/content/content/links/paths";

export const getBaseDir = () => process.env.PWD as string;

/* Folders */
export const contentFolder = path.resolve(getBaseDir(), "./../ylhyra_content");
export const buildFolder = getBaseDir() + "/build";
export const imageOutputFolder = buildFolder + "/images";

export const ylhyraContentFiles = contentFolder + "/not_data/files";

export const getUnprocessedImageUrl = (file: string) =>
  `${unprocessedImageUrl}/${encodeURIComponent(file)}`;
