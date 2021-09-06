export const contentUrl = "/api/content";
export const processed_image_url = `/api/images`;
export const unprocessed_image_url = `/api/images2`;

/* File URLs */
export const getDynamicFileUrl = (file) =>
  `/api/content?title=file/${encodeURIComponent(file.trim())}`;
export const get_processed_image_url = (file, audio) =>
  `${processed_image_url}/${audio ? "audio/" : ""}${encodeURIComponent(
    file.trim()
  )}`;

/* URL slugs */
export const URL_title = (title) => {
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
export const section_id = (title) => {
  if (!title || title.startsWith(prefix)) return title;
  return prefix +
  encodeURIComponent(URL_title(title))
    .replace(/%/g, ".")
    .replace(/([^a-z0-9.])/g, "_");
};

export const FileSafeTitle = (title) => {
  return URL_title(title)
    .replace(/(\/)/g, "_")
    .replace(/(:)/g, "_")
    .replace(/^_/g, "")
    .replace(/_+/g, "_")
    .replace(/[()]/g, "") || "frontpage";
};
