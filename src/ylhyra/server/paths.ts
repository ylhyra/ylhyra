import path from "path";

export const getBaseDir = () => process.env.PWD as string;

/* Folders */
export const contentFolder = path.resolve(getBaseDir(), "./../ylhyra_content");
export const buildFolder = getBaseDir() + "/build";
export const imageOutputFolder = buildFolder + "/images";

export const ylhyraContentFiles = contentFolder + "/not_data/files";

export const contentUrl = "/api/content";
export const processedImageUrl = `/api/images`;
export const unprocessedImageUrl = `/api/images2`;
export const getDynamicFileUrl = (file: string): string => {
  return `/api/content?title=file/${encodeURIComponent(file.trim())}`;
};
export const getProcessedImageUrl = (file: string, audio?: Boolean): string => {
  return `${processedImageUrl}/${audio ? "audio/" : ""}${encodeURIComponent(
    file.trim()
  )}`;
};
export const getUnprocessedImageUrl = (file: string) =>
  `${unprocessedImageUrl}/${encodeURIComponent(file)}`;

export const uploadPath = path.resolve(getBaseDir(), "./uploads");
