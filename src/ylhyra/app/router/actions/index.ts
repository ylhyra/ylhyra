import { isBrowser } from "modules/isBrowser";
import { updateUrl } from "ylhyra/app/router/actions/updateUrl";
import { PrerenderedDataSavedInPage } from "ylhyra/app/types";
import { existsSchedule, isUserLoggedIn } from "ylhyra/app/user/actions";

if (isBrowser) {
  window["HAS_LOADED"] = false;
  window.addEventListener("popstate", () => {
    if (window["HAS_LOADED"]) {
      void updateUrl(window.location.pathname + window.location.hash);
    }
  });
}
export const InitializeRouter = (prerenderData: PrerenderedDataSavedInPage) => {
  const is404 = window["is404"];
  void updateUrl(
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

// export const getURL = () => {
//   return decodeURI(window.location.pathname).replace(/^\//, "");
// };

let isIndexed;
export const index = (shouldIndex) => {
  if (!isBrowser) return;
  if (isIndexed !== Boolean(shouldIndex)) {
    document
      .querySelector('meta[name="robots"]')
      .setAttribute("content", shouldIndex ? "index" : "noindex");
  }
  isIndexed = shouldIndex;
};
