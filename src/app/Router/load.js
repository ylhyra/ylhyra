import axios from "app/App/axios";
import components from "app/Router/paths";
import { ReadAlongSetup } from "documents/Render/Audio/ReadAlong";
import { URL_title } from "paths";
import store from "app/App/store";
import { updateURL } from "./actions";
let cache = {};
export const loadContent = (url, prerender_data, preload, section) => {
  // console.log("loadContent");
  // console.log({ url, section });
  // throw new Error("");

  if (url in components) {
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
    set(url, cache[url], preload, section);
  } else {
    axios
      .get("/api/content", {
        params: {
          title: decodeURI(url.replace(/^\//, "").replace(/#.+/, "")) || "/",
        },
      })
      .then(async ({ data }) => {
        cache[url] = data;
        set(url, data, preload, section);
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

const set = async (url, data, preload, section) => {
  // console.log("set");
  // console.log({ url, section });
  // throw new Error("");
  if (preload) return;
  let parsed, flattenedData, header;
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
  url = data.redirect_to || url;
  updateURL(url + (section ? "#" + section : ""), data.title, true);
  ReadAlongSetup(flattenedData); // TEMP
};

export const preload = (url) => {
  loadContent(url, null, true);
};
