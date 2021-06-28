import { URL_title } from "paths";
import store from "app/App/store";
import { url_to_info } from "app/Router/paths";
import { urls as app_urls } from "app/Router/paths";
import { isBrowser } from "app/App/functions/isBrowser";
import { loadContent } from "./load";
import { clear as ClearReadAlongSetup } from "documents/Render/Audio/ReadAlong.js";
isBrowser &&
  window.addEventListener("popstate", (event) => {
    if ("state" in window.history && window.history.state !== null) {
      updateURL(window.location.pathname + window.location.hash);
    }
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

  if (url !== window.location.pathname) {
    if (replace) {
      window.history.replaceState(null, "", url);
    } else {
      window.history.pushState(null, "", url);
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
