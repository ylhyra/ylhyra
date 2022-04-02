import { isDev } from "modules/isDev";
import Analytics from "ylhyra/app/app/analytics";
import axios from "ylhyra/app/app/axios";
import { PRELOAD_ARTICLES_ON_HOVER } from "ylhyra/app/app/constants";
import store from "ylhyra/app/app/store";
import {
  index,
  isVocabularyTheFrontpage,
} from "ylhyra/app/router/actions/index";
import { updateUrl } from "ylhyra/app/router/actions/updateUrl";
import { app_urls } from "ylhyra/app/router/appUrls";
import { PrerenderedDataSavedInPage } from "ylhyra/app/types";
import { ReadAlongSetup } from "ylhyra/documents/render/audio/ReadAlong";

const CLIENT_SIDE_RENDERING_IN_DEVELOPMENT_MODE = true && isDev;

let cache: { [url: string]: PrerenderedDataSavedInPage } = {};
let expectedUrl: string | null = null;
export const abortAllThatAreNot = (url: string) => {
  expectedUrl = url;
};

export const loadContent = ({
  url,
  prerenderData,
  preload,
  section,
  isInitializing,
  callback,
}: {
  url: string;
  prerenderData?: PrerenderedDataSavedInPage;
  preload?: Boolean;
  section?: string;
  isInitializing?: Boolean;
  callback?: Function;
}) => {
  if (url in app_urls) {
    return;
  }

  /* Pre-rendered */
  if (prerenderData) {
    cache[url] = prerenderData;
  }

  if (url in cache) {
    set({ url, data: cache[url], preload, section, isInitializing, callback });
  } else {
    if (!preload) {
      expectedUrl = url;
    }
    axios
      .get("/api/content", {
        params: {
          title: decodeURI(url.replace(/#.+/, "")) || "/",
          ...(CLIENT_SIDE_RENDERING_IN_DEVELOPMENT_MODE
            ? {
                clientSideRendering: true,
              }
            : {}),
        },
      })
      .then(async ({ data }) => {
        cache[url] = data;
        if (expectedUrl === url) {
          set({ url, data, preload, section, isInitializing, callback });
        }
      })
      .catch((error) => {
        if (preload) return;
        if (error.response?.status === 404) {
          store.dispatch({
            type: "ROUTE_404",
          });
        }
      });
  }
};

/* TODO: Spaghetti code */
const set = async ({
  url,
  data,
  preload,
  section,
  isInitializing,
  callback,
}: {
  url: string;
  data: PrerenderedDataSavedInPage;
  preload: string;
  section: string;
  isInitializing: Boolean;
  callback: Function;
}) => {
  Analytics.startReadingPage(url);
  if (preload) return;
  let parsed, flattenedData;
  if ("parsed" in data) {
    parsed = data.parsed;
    flattenedData = data.flattenedData;
  } else if (CLIENT_SIDE_RENDERING_IN_DEVELOPMENT_MODE && isDev) {
    /* Only allowed in development mode */
    const Parse = (
      await import(
        /* webpackChunkName: "parse" */
        "ylhyra/documents/parse"
      )
    ).default;
    const out = Parse({
      html: data.content,
    });
    parsed = out.parsed;
    flattenedData = out.flattenedData;

    // console.log(out);

    /* Only used for the editor */
    store.dispatch({
      type: "INITIALIZE_WITH_TOKENIZED_AND_DATA",
      currentDocument: out.tokenized?.[data.header.title],

      allDocuments: out.tokenized,
      data: flattenedData,
      currentDocumentData: out.data?.[data.header.title],
      parsed: parsed,
    });

    // if(isBrowser){
    // window.currentDocumentTitle= data.header.title,
    // }
  } else {
    console.log({ data });
    console.error("No parsed in data!");
  }
  index(data.shouldBeIndexed);

  // store.dispatch({
  //   type: "LOAD_ROUTE_CONTENT",
  //   data: {
  //     parsed,
  //     header: data.header,
  //   },
  // });
  url = data.redirect_to || url;

  if (url === "/" && isVocabularyTheFrontpage()) {
    url = "/frontpage";
  }

  // console.log({ t: data.title });

  callback?.();
  await updateUrl(url + (section ? "#" + section : ""), {
    title: data.title,
    isLoadingContent: true,
    isInitializing,
    routeContent: {
      parsed,
      header: data.header,
    },
  });
  ReadAlongSetup(flattenedData);
};

export const preload = (url) => {
  if (!PRELOAD_ARTICLES_ON_HOVER) return;
  loadContent({ url, preload: true });
};
