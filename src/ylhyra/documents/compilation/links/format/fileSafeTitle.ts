import { formatUrl } from "ylhyra/documents/compilation/links/format/formatUrl";

export function fileSafeTitle(title: string): string {
  return (
    formatUrl(title)
      .replace(/(\/)/g, "_")
      .replace(/(:)/g, "_")
      .replace(/^_/g, "")
      .replace(/_+/g, "_")
      .replace(/[()]/g, "") || "frontpage"
  );
}
