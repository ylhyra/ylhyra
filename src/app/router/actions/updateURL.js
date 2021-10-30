import { URL_title } from "app/app/paths";
import store from "app/app/store";
import { app_urls } from "app/router/appUrls";
import { abortAllThatAreNot, loadContent } from "app/router/actions/load";
import { clear as ClearReadAlongSetup } from "documents/render/audio/ReadAlong";
import Analytics from "app/app/analytics";
import { isBrowser } from "app/app/functions/isBrowser";
import { renderTitle } from "server/content/renderTitle";
import { getFrontpageURL } from "app/router/actions/index";

export async function updateURL(url, options = {}) {
  let {
    title,
    replace,
    prerender_data,
    is404,
    dontChangeUrl,
    isInitializing,
    routeContent,
  } = options;
  if (isBrowser) {
    window.HAS_LOADED = true;
  }

  url = URL_title(url);
  const [pathname, section] = url.split("#");

  if (!isInitializing && pathname === store.getState().route.pathname) {
    if (section) {
      scrollToId(section);
    }
    return;
  }

  const isComponent = pathname in app_urls;

  if (isComponent) {
    Analytics.stopReadingPage();
  }
  if (url === "/") {
    url = getFrontpageURL();
  }
  if (!url.startsWith("/")) {
    url = "/" + url;
  }
  url = decodeURI(url);
  abortAllThatAreNot(url);

  if (!title && isComponent) {
    title = app_urls[pathname].title;
  }

  if (title || replace || isComponent) {
    window.document.title = renderTitle(title);
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

  if (
    !dontChangeUrl &&
    (encodeURI(url) !== window.location.pathname ||
      // Check if has parameters
      window.location.search)
  ) {
    if (replace || isInitializing || window.location.search) {
      window.history.replaceState(null, "", encodeURI(url));
    } else if ((!prerender_data && replace) || isComponent) {
      window.history.pushState(null, "", encodeURI(url));
    }
  }

  // console.log({
  //   replace,
  //   isComponent,
  // });

  if (!replace && !isComponent) {
    loadContent({
      url: pathname,
      prerender_data,
      section,
      isInitializing,
    });
  }

  if ((!prerender_data && replace) || isComponent) {
    ClearReadAlongSetup();
    store.dispatch({
      type: "ROUTE",
      content: {
        pathname: pathname,
        section: section,
        data: routeContent,
      },
    });
    if (!section) {
      window.scrollTo(0, 0);
    } else {
      scrollToId(section);
    }
  }
}

const scrollToId = (id) => {
  window.history.scrollRestoration = "manual";
  const el = document.getElementById(id);
  el?.scrollIntoView();
};
