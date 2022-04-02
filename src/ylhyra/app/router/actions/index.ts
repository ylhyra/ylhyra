import { isBrowser } from "modules/isBrowser";
import { goToUrl } from "ylhyra/app/router/actions/goToUrl";
import { PrerenderedDataSavedInPage } from "ylhyra/app/types";
import { existsSchedule, isUserLoggedIn } from "ylhyra/app/user/actions";
import store from "ylhyra/app/app/store";

/**
 * Listen to `popstate` events to be able to navigate back
 */
let hasUrlEverChanged = false;
export const urlHasChanged = () => (hasUrlEverChanged = true);
if (isBrowser) {
  window.addEventListener("popstate", () => {
    if (hasUrlEverChanged) {
      goToUrl(window.location.pathname + window.location.hash);
    }
  });
}

export const initializeRouter = (prerenderData: PrerenderedDataSavedInPage) => {
  // @ts-ignore
  const is404 = window["is404"];
  if (is404) {
    return set404();
  }

  goToUrl(
    (prerenderData?.url || window.location.pathname) + window.location.hash,
    {
      prerenderData,
      isInitializing: true,
    }
  );
};

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
export const index = (shouldIndex: Boolean) => {
  if (!isBrowser) return;
  if (isIndexed !== Boolean(shouldIndex)) {
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute("content", shouldIndex ? "index" : "noindex");
  }
  isIndexed = shouldIndex;
};
