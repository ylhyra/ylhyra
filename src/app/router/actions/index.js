import { log, logDev } from "app/app/functions/log";
import { isBrowser } from "app/app/functions/isBrowser";
import { isUserLoggedIn, existsSchedule } from "app/user/actions";
import { updateURL } from "./updateURL";

if (isBrowser) {
  window.HAS_LOADED = false;
  window.addEventListener("popstate", () => {
    // log(window.location.pathname);
    if (window.HAS_LOADED) {
      updateURL(window.location.pathname + window.location.hash);
    }
  });
}
export const InitializeRouter = (prerender) => {
  const { is404 } = window;
  updateURL(window.location.pathname + window.location.hash, {
    prerender,
    is404,
  });
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
