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
