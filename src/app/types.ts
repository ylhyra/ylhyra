import { HtmlAsJson } from "app/app/functions/html2json/types";
import { HeaderData } from "documents/compile/functions/ParseHeaderAndBody";
import { FlattenedData } from "documents/parse/types";

export type PrerenderedDataSavedInPage = {
  url: string;
  parsed: HtmlAsJson;
  header: HeaderData;
  shouldBeIndexed: Boolean;
  flattenedData: Partial<FlattenedData>;
};
