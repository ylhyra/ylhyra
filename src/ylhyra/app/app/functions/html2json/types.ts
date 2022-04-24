export type HtmlAsJson = {
  node?: "element" | "root" | "text";
  tag?: string;
  attr?: {
    [key: string]: string;
  };
  // & {
  //   definition?: WordDefinition;
  // };
  child?: HtmlAsJson[];
  text?: string;
};

export const emptyHtmlAsJsonNode: HtmlAsJson = {
  node: "text",
  text: "",
};
