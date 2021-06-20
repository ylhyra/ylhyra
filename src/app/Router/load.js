import Parse from "documents/Parse";
import axios from "app/App/axios";
import components from "app/Router/paths";
import { ReadAlongSetup } from "documents/Render/Audio/ReadAlong";
import { URL_title } from "paths.js";
import store from "app/App/store";
import { updateURL } from "./actions";
let cache = {};
export const loadContent = (url, prerender_data, preload) => {
  if (url in components) {
    return;
  }

  /* Pre-rendered */
  if (prerender_data) {
    /* TODO */
    // cache[url] = prerender_data;
    // store.dispatch({
    //   type: "LOAD_ROUTE_CONTENT",
    //   data: prerender_data,
    // });
  } else if (url in cache) {
    set(url, cache[url], preload);
  } else {
    axios
      .get("/api/content", {
        params: {
          title: url.replace(/^\//, ""),
        },
      })
      .then(async ({ data }) => {
        cache[url] = data;
        set(url, data, preload);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 404) {
          // this.setState({ error: 404 });
        }
      });
  }
};

const set = (url, data, preload) => {
  if (preload) return;
  const { parsed, flattenedData } = Parse({
    html: data.content,
  });
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
