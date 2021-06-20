import { URL_title } from "paths.js";
import store from "app/App/store";
import { url_to_info } from "app/Router/paths";
import { urls as app_urls } from "app/Router/paths";
import { isBrowser } from "app/App/functions/isBrowser";
import axios from "app/App/axios";
import components from "app/Router/paths";

isBrowser &&
  window.addEventListener("popstate", (event) => {
    updateURL(window.location.pathname);
  });

export const InitializeRouter = (prerender) => {
  updateURL(
    window.location.pathname + window.location.hash,
    null,
    null,
    prerender
  );
};

export const updateURL = (url, title, replace, prerender) => {
  if (url in app_urls) {
    url = app_urls[url].url;
  }
  if (!url.startsWith("/")) {
    url = "/" + url;
  }
  url = decodeURI(url);

  const [pathname, section] = url.split("#");
  if (!title && pathname in url_to_info) {
    title = url_to_info[pathname].title;
  }
  window.document.title = (title ? title + "\u2006•\u200A" : "") + "Ylhýra";

  /*
    Force vocabulary game to keep the URL of the article it is started on
  */
  if (url === "/vocabulary/play") {
    store.dispatch({
      type: "ROUTE",
      content: {
        pathname: url,
      },
    });
    /* ?? */
    window.history.pushState(null, "", window.location.pathname);
    return;
  }

  if (url !== window.location.pathname) {
    if (replace) {
      window.history.replaceState(null, "", url);
    } else {
      window.history.pushState(null, "", url);
    }
  }

  if (!replace) {
    store.dispatch({
      type: "ROUTE",
      content: {
        pathname: pathname,
        section: section,
      },
    });
  }
  loadContent(url, prerender);
};

export const getURL = () => {
  return decodeURI(window.location.pathname).replace(/^\//, "");
};

let cache = {};
export const loadContent = (url, prerender_data) => {
  if (url in components) {
    return;
  }

  /* Pre-rendered */
  if (prerender_data) {
    cache[url] = prerender_data;
    store.dispatch({
      type: "LOAD_ROUTE_CONTENT",
      data: prerender_data,
    });
  } else if (url in cache) {
    store.dispatch({
      type: "LOAD_ROUTE_CONTENT",
      data: cache[url],
    });
  } else {
    axios
      .get("/api/content", {
        params: {
          title: url.replace(/^\//, ""),
        },
      })
      .then(async ({ data }) => {
        cache[url] = data.content;
        store.dispatch({
          type: "LOAD_ROUTE_CONTENT",
          data: data.content,
        });
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 404) {
          // this.setState({ error: 404 });
        }
      });
  }
};
