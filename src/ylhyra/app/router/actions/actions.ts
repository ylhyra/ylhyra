import { isBrowser } from "modules/isBrowser";
import store from "ylhyra/app/app/store";
import { goToUrl } from "ylhyra/app/router/actions/goToUrl";
import { cachePrerenderedData } from "ylhyra/app/router/actions/load";
import { PrerenderedDataSavedInPage } from "ylhyra/app/types";
import { existsSchedule, isUserLoggedIn } from "ylhyra/app/user/actions";

/** Listen to `popstate` events to be able to navigate back */
let hasUrlEverChanged = false;
export const urlHasChanged = () => (hasUrlEverChanged = true);
if (isBrowser) {
  window.addEventListener("popstate", () => {
    if (hasUrlEverChanged) {
      goToUrl(window.location.pathname + window.location.hash);
    }
  });
}

export function initializeRouter(
  prerenderData: PrerenderedDataSavedInPage | null
) {
  // @ts-ignore
  if (window["is404"]) {
    return set404();
  }
  const url =
    (prerenderData?.url || decodeURI(window.location.pathname)) +
    window.location.hash;
  if (prerenderData) {
    cachePrerenderedData(url.split("#")[0], prerenderData);
  }
  goToUrl(url, {
    isInitializing: true,
  });
}

export const set404 = () => {
  store.dispatch({
    type: "ROUTE_404",
  });
};

export const isVocabularyTheFrontpage = () => {
  return isUserLoggedIn() || existsSchedule();
};

export const getFrontpageURL = () => {
  return isVocabularyTheFrontpage() ? "/frontpage" : "/";
};

let isIndexed: Boolean;
export function setIndexing(shouldIndex: Boolean | undefined) {
  if (!isBrowser) return;
  if (isIndexed !== Boolean(shouldIndex)) {
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute("content", shouldIndex ? "index" : "noindex");
  }
  isIndexed = Boolean(shouldIndex);
}
