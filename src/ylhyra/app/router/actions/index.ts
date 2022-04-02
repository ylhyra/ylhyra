import { isBrowser } from "modules/isBrowser";
import { updateUrl } from "ylhyra/app/router/actions/updateUrl";
import { PrerenderedDataSavedInPage } from "ylhyra/app/types";
import { existsSchedule, isUserLoggedIn } from "ylhyra/app/user/actions";

if (isBrowser) {
  // @ts-ignore
  window["HAS_LOADED"] = false;
  window.addEventListener("popstate", () => {
    // @ts-ignore
    if (window["HAS_LOADED"]) {
      updateUrl(window.location.pathname + window.location.hash);
    }
  });
}
export const initializeRouter = (prerenderData: PrerenderedDataSavedInPage) => {
  // @ts-ignore
  const is404 = window["is404"];
  updateUrl(
    (prerenderData?.url || window.location.pathname) + window.location.hash,
    {
      prerenderData,
      is404,
      isInitializing: true,
    }
  );
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
