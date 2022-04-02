import store from "ylhyra/app/app/store";
import { isDev } from "modules/isDev";
import { PrerenderedDataSavedInPage } from "ylhyra/app/types";
import axios from "ylhyra/app/app/axios";
import Analytics from "ylhyra/app/app/analytics";
import { goToUrl } from "ylhyra/app/router/actions/goToUrl";
import { readAlongSetup } from "ylhyra/documents/render/audio/readAlong/readAlong";
import {
  index,
  isVocabularyTheFrontpage,
} from "ylhyra/app/router/actions/index";

const CLIENT_SIDE_RENDERING_IN_DEVELOPMENT_MODE = true && isDev;

let cache: { [url: string]: PrerenderedDataSavedInPage } = {};
let expectedUrl: string | null = null;
export const abortLoadingOtherUrls = (url: string) => {
  expectedUrl = url;
};

export function savePrerenderedData(
  pathname,
  prerenderData: PrerenderedDataSavedInPage
) {
  cache[pathname] = prerenderData;
}

/**
 * Load content from server, or serve cached.
 */
export function loadContent({ pathname, section }) {
  if (pathname in cache) {
    set({ pathname, data: cache[pathname], section });
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
          store.dispatch({
            type: "ROUTE_404",
          });
        }
      });
  }
}

/**
 * Apply the loaded data and set up page
 */
function setContent({
  pathname,
  section,
  data,
}: {
  pathname: string;
  section?: string;
  data: PrerenderedDataSavedInPage;
}) {
  Analytics.startReadingPage(pathname);
  let { parsed, flattenedData } = data;
  parsed = data.parsed;
  flattenedData = data.flattenedData;
  index(data.shouldBeIndexed);

  // store.dispatch({
  //   type: "LOAD_ROUTE_CONTENT",
  //   data: {
  //     parsed,
  //     header: data.header,
  //   },
  // });
  url = data.redirect_to || url;

  goToUrl(url + (section ? "#" + section : ""), {
    title: data.title,
    isLoadingContent: true,
    isInitializing,
    routeContent: {
      parsed,
      header: data.header,
    },
  });
  readAlongSetup(flattenedData);
}

async function parseInFrontendIfInDevelopmentMode({
  pathname,
  section,
  data,
}: {
  pathname: string;
  section?: string;
  data: PrerenderedDataSavedInPage & { content: string };
}) {
  /* Only allowed in development mode */
  const Parse = (
    await import(
      /* webpackChunkName: "parse" */
      "ylhyra/documents/parse"
    )
  ).default;
  const out = Parse({
    html: data.content,
  });
  const { parsed, flattenedData } = out;

  /* Only used for the editor */
  store.dispatch({
    type: "INITIALIZE_WITH_TOKENIZED_AND_DATA",
    currentDocument: out.tokenized?.[data.header.title],
    allDocuments: out.tokenized,
    data: flattenedData,
    currentDocumentData: out.data?.[data.header.title],
    parsed: parsed,
  });
}
