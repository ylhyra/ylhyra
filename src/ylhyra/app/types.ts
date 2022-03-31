import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import { HeaderData } from "ylhyra/documents/compile/functions/ParseHeaderAndBody";
import { FlattenedData } from "ylhyra/documents/parse/types";

export type PrerenderedDataSavedInPage = {
  url: string;
  parsed: HtmlAsJson;
  header: HeaderData;
  shouldBeIndexed: Boolean;
  flattenedData: Partial<FlattenedData>;
};
