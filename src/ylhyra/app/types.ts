import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import { HeaderData } from "ylhyra/documents/compilation/compileDocument/types";
import { FlattenedData } from "ylhyra/documents/types/types";

export type PrerenderedDataSavedInPage = {
  url: string;
  parsed: HtmlAsJson;
  flattenedData: Partial<FlattenedData>;
  header: HeaderData;
  shouldBeIndexed?: Boolean;
  redirect_to?: string;
  // title: string;
};
