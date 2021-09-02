import { URL_title } from "paths";
import store from "app/app/store";
import { url_to_info } from "app/router/paths";
import { urls as app_urls } from "app/router/paths";
import { loadContent, abortAllThatAreNot } from "app/router/actions/load";
import { clear as ClearReadAlongSetup } from "documents/render/audio/ReadAlong";
import Analytics from "app/app/analytics";
import { getFrontpageURL } from "./index";
import { isBrowser } from "app/app/functions/isBrowser";

export async function updateURL(url, options = {}) {
  let { title, replace, prerender, is404, dontChangeUrl } = options;
  if (isBrowser) {
    window.HAS_LOADED = true;
  }
  const isComponent = url in app_urls;
  if (isComponent) {
    url = app_urls[url].url;
    Analytics.stopReadingPage();
  } else {
    url = URL_title(url);
  }
  if (url === "/") {
    url = getFrontpageURL();
  }
  if (!url.startsWith("/")) {
    url = "/" + url;
  }
  url = decodeURI(url);
  abortAllThatAreNot(url);

  const [pathname, section] = url.split("#");
  if (!title && pathname in url_to_info) {
    title = url_to_info[pathname].title;
  }
  window.document.title = (title ? title + "\u2006•\u2006" : "") + "Ylhýra";

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

  if (!dontChangeUrl && encodeURI(url) !== window.location.pathname) {
    if (replace) {
      window.history.replaceState(null, "", encodeURI(url));
    } else {
      window.history.pushState(null, "", encodeURI(url));
    }
  }

  if (!section) {
    window.scrollTo(0, 0);
  } else {
    window.history.scrollRestoration = "manual";
    const el = document.getElementById(section);
    el?.scrollIntoView();
  }

  if (!replace && !isComponent) {
    loadContent({
      url: pathname,
      prerender_data: prerender,
      section,
    });
  }
  if (!prerender && replace) {
    ClearReadAlongSetup();
    store.dispatch({
      type: "ROUTE",
      content: {
        pathname: pathname,
        section: section,
      },
    });
  }
}
