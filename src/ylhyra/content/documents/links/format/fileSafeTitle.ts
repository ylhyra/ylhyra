import { formatUrl } from "ylhyra/content/documents/links/format/formatUrl";

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
