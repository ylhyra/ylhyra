global.__basedir = __dirname + "/../";

/* Folders */
export const content_folder = __basedir + "/../ylhyra_content";
export const output_folder = __basedir + "/build";
export const image_output_folder = output_folder + "/images";

/* File URLs */
export const contentUrl = "/api/content";
export const processed_image_url = `/api/images`;
export const unprocessed_image_url = `/api/images2`;
export const getDynamicFileUrl = (file) =>
  `/api/content?title=file/${encodeURIComponent(file.trim())}`;
export const get_processed_image_url = (file) =>
  `${processed_image_url}/${encodeURIComponent(file.trim())}`;
export const ylhyra_content_files = content_folder + "/not_data/files";

export const get_unprocessed_image_url = (file) =>
  `${unprocessed_image_url}/${encodeURIComponent(file)}`;

/* URL slugs */
export const URL_title = (title) => {
  if (!title) return title;
  let [path, section] = title.split("#");
  path = path
    .toLowerCase()
    .trim()
    .replace(/([_ ])/g, "-")
    .replace(/-+/g, "-")
    .replace(/(\?)/g, "")
    .replace(/:/g, "/")
    .replace(/^\//g, "");
  section = section_id(section);
  return path + (section ? "#" + section : "");
};

const prefix = "section-";
export const section_id = (title) => {
  if (!title || title.startsWith(prefix)) return title;
  return (
    prefix +
    encodeURIComponent(URL_title(title))
      .replace(/%/g, ".")
      .replace(/([^a-z0-9.])/g, "_")
  );
};

export const FileSafeTitle = (title) => {
  return (
    URL_title(title)
      .replace(/(\/)/g, "_")
      .replace(/(:)/g, "_")
      .replace(/[()]/g, "") || "frontpage"
  );
};
