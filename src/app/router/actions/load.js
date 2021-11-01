import Analytics from "app/app/analytics";
import axios from "app/app/axios";
import store from "app/app/store";
import { index, isVocabularyTheFrontpage } from "app/router/actions";
import { updateURL } from "app/router/actions/updateURL";
import { app_urls } from "app/router/appUrls";
import { ReadAlongSetup } from "documents/render/audio/ReadAlong";
import { isDev } from "app/app/functions/isDev";
import { PRELOAD_ARTICLES_ON_HOVER } from "app/app/constants";

const CLIENT_SIDE_RENDERING_IN_DEVELOPMENT_MODE = true && isDev;

let cache = {};
let expectedUrl = false;
export const abortAllThatAreNot = (url) => {
  expectedUrl = url;
};

export const loadContent = ({
  url,
  prerender_data,
  preload,
  section,
  isInitializing,
  callback,
}) => {
  if (url in app_urls) {
    return;
  }

  /* Pre-rendered */
  if (prerender_data) {
    cache[url] = prerender_data;
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
            type: "LOAD_ROUTE_CONTENT",
            data: "404",
          });
        }
      });
  }
};

const set = async ({
  url,
  data,
  preload,
  section,
  isInitializing,
  callback,
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
        "../../../documents/parse"
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
  updateURL(url + (section ? "#" + section : ""), {
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
