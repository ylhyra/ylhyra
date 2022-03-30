export type HtmlAsJson = {
  node: "element" | "root" | "text";
  tag: string;
  attr: {
    [key: string]: string;
  };
  child: HtmlAsJson[];
  text?: string;
};
