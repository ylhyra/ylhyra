import Analytics from "ylhyra/app/app/analytics";
import { HtmlAsJson } from "ylhyra/app/app/functions/html2json/types";
import store from "ylhyra/app/app/store";
import {
  getFrontpageURL,
  urlHasChanged,
} from "ylhyra/app/router/actions/actions";

import {
  abortLoadingOtherUrls,
  loadContent,
} from "ylhyra/app/router/actions/load";
import { appUrls } from "ylhyra/app/router/appUrls";
import { PrerenderedDataSavedInPage } from "ylhyra/app/types";
import { HeaderData } from "ylhyra/content/documents/compileDocument/functions/readContentFile";
import { renderTitle } from "ylhyra/content/documents/links/format/renderTitle";
import { formatUrl } from "ylhyra/content/documents/links/format/formatUrl";

export type RouteContent = {
  parsed: HtmlAsJson;
  header: HeaderData;
};

type UpdateURLOptions = {
  /** Used by the "Tutorial" button */
  dontChangeUrl?: Boolean;
  isInitializing?: Boolean;
  initializationData?: PrerenderedDataSavedInPage;
};

export function goToUrl(url: string, options: UpdateURLOptions = {}) {
  let { dontChangeUrl, isInitializing, initializationData } = options;
  let [pathname, section] = formatUrl(url).split("#");
  Analytics.stopReadingPage();

  /** Used to be able to listen to `popstate` events */
  urlHasChanged();

  abortLoadingOtherUrls(pathname);

  if (pathname === "/") {
    pathname = getFrontpageURL();
  } else if (pathname === "/vocabulary/play") {
    return goToVocabularyGame();
  }

  /** Link goes to the current page */
  if (pathname === store.getState().route.pathname && !isInitializing) {
    if (section) {
      scrollToId(section);
    }
    return;
  }

  if (pathname in appUrls) {
    setUrl({ pathname, section });
  } else {
    if (isInitializing) {
    }
    loadContent({ pathname, section, isInitializing });
  }
}

export function setUrl({
  pathname,
  section,
  title,
  routeContent,
}: {
  pathname: string;
  section?: string;
  title?: string;
  routeContent?: RouteContent;
}) {
  const url = pathname + (section ? "#" + section : "");
  setHistory(url);
  setTitle(pathname, title);
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

function setTitle(pathname: string, title?: string) {
  if (pathname in appUrls) {
    title = appUrls[pathname].title;
  }
  if (title) {
    window.document.title = renderTitle(title);
  }
}

export function setHistory(url: string, type: "push" | "replace" = "push") {
  if (type === "push") {
    window.history.pushState(null, "", encodeURI(url));
  } else {
    window.history.replaceState(null, "", encodeURI(url));
  }
}

/**
 * Force vocabulary game to keep the URL of the article it is started on
 */
export function goToVocabularyGame() {
  store.dispatch({
    type: "ROUTE",
    content: {
      pathname: "/vocabulary/play",
    },
  });
  window.history.pushState(null, "", window.location.pathname);
}

const scrollToId = (id: string) => {
  window.history.scrollRestoration = "manual";
  document.getElementById(id)?.scrollIntoView();
};
