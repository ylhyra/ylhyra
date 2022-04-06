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
  section = getSectionId(section);
  return path + (section ? "#" + section : "");
};

const sectionPrefix = "section-";
export const getSectionId = (title: string): string => {
  if (!title || title.startsWith(sectionPrefix)) return title;
  return (
    sectionPrefix +
    encodeURIComponent(formatUrl(title).replace(/^\//, ""))
      .replace(/%/g, "_")
      .replace(/([^a-z0-9_])/g, "_")
  );
};
