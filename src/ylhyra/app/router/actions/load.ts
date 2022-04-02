import store from "ylhyra/app/app/store";
import { isDev } from "modules/isDev";
import { PrerenderedDataSavedInPage } from "ylhyra/app/types";
import axios from "ylhyra/app/app/axios";
import Analytics from "ylhyra/app/app/analytics";
import { setUrl } from "ylhyra/app/router/actions/goToUrl";
import { readAlongSetup } from "ylhyra/documents/render/audio/readAlong/readAlong";
import { set404, setIndexing } from "ylhyra/app/router/actions/actions";
import { parseInFrontendIfInDevelopmentMode } from "ylhyra/app/router/actions/parseInDevMode";

const CLIENT_SIDE_RENDERING_IN_DEVELOPMENT_MODE = true && isDev;

let cache: { [url: string]: PrerenderedDataSavedInPage } = {};
let expectedUrl: string | null = null;
export const abortLoadingOtherUrls = (url: string) => {
  expectedUrl = url;
};

export function cachePrerenderedData(
  pathname: string,
  prerenderData: PrerenderedDataSavedInPage
) {
  if (prerenderData) {
    cache[pathname] = prerenderData;
  }
}

/**
 * Load content from server, or serve cached.
 */
export function loadContent({
  pathname,
  section,
  isInitializing,
}: {
  pathname: string;
  section?: string;
  isInitializing?: Boolean;
}) {
  if (pathname in cache) {
    setContent({ pathname, data: cache[pathname], section });
  } else {
    expectedUrl = pathname;
    axios
      .get("/api/content", {
        params: {
          title: pathname,
          ...(CLIENT_SIDE_RENDERING_IN_DEVELOPMENT_MODE
            ? {
                clientSideRendering: true,
              }
            : {}),
        },
      })
      .then(({ data }) => {
        if ("parsed" in data) {
          cache[pathname] = data;
          if (expectedUrl === pathname) {
            setContent({ pathname, section, data });
          }
        } else if (CLIENT_SIDE_RENDERING_IN_DEVELOPMENT_MODE) {
          void parseInFrontendIfInDevelopmentMode({ pathname, section, data });
        } else {
          throw new Error("Could not load content");
        }
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          set404();
        }
      });
  }
}

/**
 * Apply the loaded data and set up page
 */
export function setContent({
  pathname,
  section,
  data,
}: {
  pathname: string;
  section?: string;
  data: PrerenderedDataSavedInPage;
}) {
  Analytics.startReadingPage(pathname);
  const { parsed, flattenedData } = data;
  setIndexing(data.shouldBeIndexed);
  if (data.redirect_to) {
    pathname = data.redirect_to.split("#")[0];
    section = data.redirect_to.split("#")[1];
  }

  setUrl({
    pathname,
    section,
    title: data.title,
    routeContent: {
      parsed,
      header: data.header,
    },
  });

  readAlongSetup(flattenedData);
}
