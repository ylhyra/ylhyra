import { PrerenderedDataSavedInPage } from "ylhyra/app/types";
import store from "ylhyra/app/app/store";
import { setContent } from "ylhyra/app/router/actions/load";

export async function parseInFrontendIfInDevelopmentMode({
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

  setContent({
    pathname,
    section,
    data: {
      parsed,
      flattenedData,
    },
  });
}
