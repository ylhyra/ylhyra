import Analytics from "app/app/analytics";
import axios from "app/app/axios";
import store from "app/app/store";
import { index, isVocabularyTheFrontpage } from "app/router/actions";
import { updateURL } from "app/router/actions/updateURL";
import { app_urls } from "app/router/appUrls";
import { ReadAlongSetup } from "documents/render/audio/ReadAlong";
import { isDev } from "app/app/functions/isDev";
import { constants } from "app/app/constants";

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
  callback,
}) => {
  console.log(url);
  if (url in app_urls || (url === "/" && isVocabularyTheFrontpage())) {
    return;
  }

  /* Pre-rendered */
  if (prerender_data) {
    cache[url] = { parsed: prerender_data };
    store.dispatch({
      type: "LOAD_ROUTE_CONTENT",
      data: { parsed: prerender_data },
      pathname: url,
    });
  } else if (url in cache) {
    set(url, cache[url], preload, section, callback);
  } else {
    if (!preload) {
      expectedUrl = url;
    }
    axios
      .get("/api/content", {
        params: {
          title: decodeURI(url.replace(/^\//, "").replace(/#.+/, "")) || "/",
        },
      })
      .then(async ({ data }) => {
        cache[url] = data;
        if (expectedUrl === url) {
          set(url, data, preload, section, callback);
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

const set = async (url, data, preload, section, callback) => {
  Analytics.startReadingPage(url);
  if (preload) return;
  let parsed, flattenedData;
  if ("parsed" in data) {
    parsed = data.parsed;
    flattenedData = data.flattenedData;
  } else if (isDev) {
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
  }
  index(data.shouldBeIndexed);

  store.dispatch({
    type: "LOAD_ROUTE_CONTENT",
    data: {
      parsed,
      header: data.header,
    },
  });
  url = data.redirect_to || url;

  if (url === "/" && isVocabularyTheFrontpage()) {
    url = "/frontpage";
  }

  callback?.();
  updateURL(url + (section ? "#" + section : ""), {
    title: data.title,
    replace: true,
  });
  ReadAlongSetup(flattenedData);
};

export const preload = (url) => {
  if (!constants.PRELOAD_ARTICLES_ON_HOVER) return;
  loadContent({ url, preload: true });
};
