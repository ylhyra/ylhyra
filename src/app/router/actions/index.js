import { existsSchedule, isUserLoggedIn } from "app/user/actions";
import { isBrowser } from "app/app/functions/isBrowser";

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
export const InitializeRouter = (prerender_data) => {
  const { is404 } = window;
  updateURL(
    (prerender_data?.url || window.location.pathname) + window.location.hash,
    {
      prerender_data,
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
