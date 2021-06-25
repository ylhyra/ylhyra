import axios from "app/App/axios";
import components from "app/Router/paths";
import { ReadAlongSetup } from "documents/Render/Audio/ReadAlong";
import { URL_title } from "paths";
import store from "app/App/store";
import { updateURL } from "./actions";
let cache = {};
export const loadContent = (url, prerender_data, preload) => {
  if (url in components) {
    return;
  }

  /* Pre-rendered */
  if (prerender_data) {
    cache[url] = { parsed: prerender_data };
    store.dispatch({
      type: "LOAD_ROUTE_CONTENT",
      data: { parsed: prerender_data },
    });
  } else if (url in cache) {
    set(url, JSON.parse(cache[url]), preload);
  } else {
    axios
      .get("/api/content", {
        params: {
          title: decodeURI(url.replace(/^\//, "").replace(/#.+/, "")) || "/",
        },
      })
      .then(async ({ data }) => {
        cache[url] = JSON.stringify(data);
        set(url, data, preload);
      })
      .catch((error) => {
        console.log(error);
        if (preload) return;
        if (error.response && error.response.status === 404) {
          store.dispatch({
            type: "LOAD_ROUTE_CONTENT",
            data: "404",
          });
        }
      });
  }
};

const set = async (url, data, preload) => {
  if (preload) return;
  let parsed, flattenedData;
  if ("parsed" in data) {
    parsed = data.parsed;
    flattenedData = data.flattenedData;
  } else {
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
  store.dispatch({
    type: "LOAD_ROUTE_CONTENT",
    data: {
      parsed,
      header: data.header,
    },
  });
  updateURL(url, data.title, true);
  ReadAlongSetup(flattenedData); // TEMP
};

export const preload = (url) => {
  loadContent(url, null, true);
};
