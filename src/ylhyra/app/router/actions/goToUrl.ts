import { isBrowser } from "modules/isBrowser";
import Analytics from "ylhyra/app/app/analytics";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import { URL_title } from "ylhyra/app/app/paths";
import store from "ylhyra/app/app/store";
import { getFrontpageURL } from "ylhyra/app/router/actions/index";
import {
  abortAllThatAreNot,
  loadContent,
} from "ylhyra/app/router/actions/load";
import { appUrls } from "ylhyra/app/router/appUrls";
import { PrerenderedDataSavedInPage } from "ylhyra/app/types";
import { HeaderData } from "ylhyra/documents/compile/functions/ParseHeaderAndBody";
import { clearReadAlongSetup } from "ylhyra/documents/render/audio/readAlong/readAlong";
import { renderTitle } from "ylhyra/server/content/renderTitle";

export type RouteContent = {
  parsed: HtmlAsJson;
  header: HeaderData;
};

type UpdateURLOptions = {
  title?: string;
  isLoadingContent?: Boolean;
  prerenderData?: PrerenderedDataSavedInPage;
  is404?: Boolean;
  dontChangeUrl?: Boolean;
  isInitializing?: Boolean;
  routeContent?: RouteContent;
};

export function updateUrl(url: string, options: UpdateURLOptions = {}) {
  let {
    title,
    isLoadingContent,
    prerenderData,
    is404,
    dontChangeUrl,
    isInitializing,
    routeContent,
  } = options;
  if (isBrowser) {
    // @ts-ignore
    window["HAS_LOADED"] = true;
  }
}

const scrollToId = (id: string) => {
  window.history.scrollRestoration = "manual";
  document.getElementById(id)?.scrollIntoView();
};
