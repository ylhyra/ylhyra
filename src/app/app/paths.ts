export const contentUrl = "/api/content";
export const processed_image_url = `/api/images`;
export const unprocessed_image_url = `/api/images2`;

/* File URLs */
export const getDynamicFileUrl = (file: string): string => {
  return `/api/content?title=file/${encodeURIComponent(file.trim())}`;
};

export const getProcessedImageUrl = (file: string, audio?: Boolean): string => {
  return `${processed_image_url}/${audio ? "audio/" : ""}${encodeURIComponent(
    file.trim()
  )}`;
};

/* URL slugs */
export const URL_title = (title: string): string => {
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
  section = section_id(section);
  return path + (section ? "#" + section : "");
};

const prefix = "section-";
export const section_id = (title: string): string => {
  if (!title || title.startsWith(prefix)) return title;
  return (
    prefix +
    encodeURIComponent(URL_title(title).replace(/^\//, ""))
      .replace(/%/g, "_")
      .replace(/([^a-z0-9_])/g, "_")
  );
};

export const FileSafeTitle = (title: string): string => {
  return (
    URL_title(title)
      .replace(/(\/)/g, "_")
      .replace(/(:)/g, "_")
      .replace(/^_/g, "")
      .replace(/_+/g, "_")
      .replace(/[()]/g, "") || "frontpage"
  );
};
