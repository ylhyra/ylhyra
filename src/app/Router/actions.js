import { URL_title } from "paths";
import store from "app/App/store";
import { url_to_info } from "app/Router/paths";
import { urls as app_urls } from "app/Router/paths";
import { isBrowser } from "app/App/functions/isBrowser";
import { loadContent } from "./load";
import { clear as ClearReadAlongSetup } from "documents/Render/Audio/ReadAlong.js";
let HAS_LOADED = false;
if (isBrowser) {
  window.addEventListener("popstate", (event) => {
    if (HAS_LOADED) {
      console.log("haha");
      updateURL(window.location.pathname + window.location.hash);
    }
  });
}
export const InitializeRouter = (prerender) => {
  const is404 = window.is404;
  updateURL(
    window.location.pathname + window.location.hash,
    null,
    null,
    prerender,
    is404
  );
};

export const updateURL = (url, title, replace, prerender, is404) => {
  HAS_LOADED = true;
  if (url in app_urls) {
    url = app_urls[url].url;
  } else {
    url = URL_title(url);
  }
  if (!url.startsWith("/")) {
    url = "/" + url;
  }
  url = decodeURI(url);

  const [pathname, section] = url.split("#");
  if (!title && pathname in url_to_info) {
    title = url_to_info[pathname].title;
  }
  if (title) {
    window.document.title = (title ? title + "\u2006•\u2006" : "") + "Ylhýra";
  }

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

  if (is404) {
    store.dispatch({
      type: "LOAD_ROUTE_CONTENT",
      data: "404",
    });
    return;
  }

  if (url !== "/vocabulary/tutorial") {
    if (url !== window.location.pathname) {
      if (replace) {
        window.history.replaceState(null, "", url);
      } else {
        window.history.pushState(null, "", url);
      }
    }
  }

  if (!replace) {
    if (!prerender) {
      ClearReadAlongSetup();
      store.dispatch({
        type: "ROUTE",
        content: {
          pathname: pathname,
          section: section,
        },
      });
    }
    loadContent(pathname, prerender, null, section);
  }
  if (!section) {
    window.scrollTo(0, 0);
  } else {
    window.history.scrollRestoration = "manual";
    const el = document.getElementById(section);
    el && el.scrollIntoView();
  }
};

export const getURL = () => {
  return decodeURI(window.location.pathname).replace(/^\//, "");
};
