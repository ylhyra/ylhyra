import { isVocabularyTheFrontpage } from "app/Router/actions";
import axios from "app/App/axios";
import components from "app/Router/paths";
import { ReadAlongSetup } from "documents/Render/Audio/ReadAlong";
import { URL_title } from "paths";
import store from "app/App/store";
import { updateURL, index } from "./actions";
import Analytics from "app/Analytics";
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
  // console.log("loadContent");
  // console.log({ url, section });
  // throw new Error("");
  if (url in components || (url === "/" && isVocabularyTheFrontpage())) {
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
        console.log(error);
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
  // console.log("set");
  // console.log({ url, section });
  // throw new Error("");
  if (preload) return;
  let parsed, flattenedData, header;
  if ("parsed" in data) {
    parsed = data.parsed;
    flattenedData = data.flattenedData;
  } else if (process.env.NODE_ENV === "development") {
    /* Only allowed in development mode */
    const Parse = (
      await import(
        /* webpackChunkName: "parse" */
        "./../../documents/Parse"
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
  ReadAlongSetup(flattenedData); // TEMP?
};

export const preload = (url) => {
  loadContent({ url, preload: true });
};
