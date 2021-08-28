import { URL_title } from "paths";
import store from "app/App/store";
import { url_to_info } from "app/Router/paths";
import { urls as app_urls } from "app/Router/paths";
import { isBrowser } from "app/App/functions/isBrowser";
import { loadContent, abortAllThatAreNot } from "./load";
import { clear as ClearReadAlongSetup } from "documents/Render/Audio/ReadAlong";
import { isUserLoggedIn, existsSchedule } from "app/User/actions";
import Analytics from "app/Analytics";

let HAS_LOADED = false;
if (isBrowser) {
  window.addEventListener("popstate", (event) => {
    // console.log(window.location.pathname);
    if (HAS_LOADED) {
      updateURL(window.location.pathname + window.location.hash);
    }
  });
}
export const InitializeRouter = (prerender) => {
  const { is404 } = window;
  updateURL(
    window.location.pathname + window.location.hash,
    null,
    null,
    prerender,
    is404
  );
};

export const isVocabularyTheFrontpage = () => {
  return isUserLoggedIn() || existsSchedule();
};

export const getFrontpageURL = () => {
  return isVocabularyTheFrontpage() ? "/frontpage" : "/";
  // return isVocabularyTheFrontpage() ? "/vocabulary" : "/";
};

export const updateURL = (url, title, replace, prerender, is404) => {
  HAS_LOADED = true;
  let is_component = url in app_urls;
  // console.log({ url });
  if (url in app_urls) {
    url = app_urls[url].url;
    Analytics.stopReadingPage();
  } else {
    url = URL_title(url);
  }
  // console.log({ url });
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

  if (
    url !== "/vocabulary/tutorial" &&
    encodeURI(url) !== window.location.pathname
  ) {
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

  if (!replace) {
    // const x = () => {
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
    // };
    // if (!is_component) {
    //   loadContent(pathname, prerender, null, section, x);
    //   return;
    // } else {
    //   x();
    // }
  }
};

export const getURL = () => {
  return decodeURI(window.location.pathname).replace(/^\//, "");
};

// let isIndexed;
export const index = (shouldIndex) => {
  // if (!isBrowser) return;
  // if (isIndexed !== Boolean(shouldIndex)) {
  //   document
  //     .querySelector('meta[name="robots"]')
  //     .setAttribute("content", shouldIndex ? "index" : "noindex");
  // }
  // isIndexed = shouldIndex;
};
