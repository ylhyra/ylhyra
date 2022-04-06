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

/**
 * Returns the URL slug for a given title.
 * Can also be used to convert URLs to a consistent format.
 */
export const formatUrl = (title: string): string => {
  if (!title) return "/";
  let [path, section] = title.split("#");
  path = path
    .toLowerCase()
    .trim()
    .replace(/([_ –—])/g, "-")
    .replace(/[(),!?;]/g, "")
    .replace(/-+/g, "-")
    .replace(/:/g, "/")
    .replace(/[/]+/g, "/")
    .replace(/^\//g, "")
    .replace(/\/$/g, "");
  path = "/" + path;
  section = sectionId(section);
  return path + (section ? "#" + section : "");
};

const prefix = "section-";
export const sectionId = (title: string): string => {
  if (!title || title.startsWith(prefix)) return title;
  return (
    prefix +
    encodeURIComponent(formatUrl(title).replace(/^\//, ""))
      .replace(/%/g, "_")
      .replace(/([^a-z0-9_])/g, "_")
  );
};

export const fileSafeTitle = (title: string): string => {
  return (
    formatUrl(title)
      .replace(/(\/)/g, "_")
      .replace(/(:)/g, "_")
      .replace(/^_/g, "")
      .replace(/_+/g, "_")
      .replace(/[()]/g, "") || "frontpage"
  );
};
