// @ts-ignore
import atob from "atob";
// @ts-ignore
import btoa from "btoa";

export const removeComments = (i: string) =>
  i.replace(/<!--([\s\S]+?)-->/g, "").replace(/\n<!--([\s\S]+?)-->\n/g, "\n");

/**
 * Returns Base64-encoded
 */
export const encodeDataInHtml = (input: any) => {
  if (!input) return;
  return btoa(
    encodeURIComponent(
      typeof input === "string" ? input : JSON.stringify(input)
    )
  );
};

export const decodeDataInHtml = (input: any, isString: boolean = false) => {
  if (!input) return;
  const v = decodeURIComponent(atob(input));
  return isString ? v : JSON.parse(v);
};
