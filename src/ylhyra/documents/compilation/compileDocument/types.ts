import { Html } from "inflection/tables/types";

export type HeaderData = HeaderDataInYamlHeader & HeaderDataValuesThatAreDynamicallyCreated

/**
 * These values are a part of the Yaml header
 */
export type HeaderDataInYamlHeader = {
  /** The URL is derived from the title */
  "title": string;
  /** Or we can overwrite the URL that was derived from the title */
  "url"?: string;
  /** CEFR level */
  "level"?: string;
  "license"?: 'CC0';
  /** List of incoming redirects */
  "redirects"?: string[];
  "published"?: boolean;
  /** If we alter third party content, we need to mention that in the footer  */
  "typos fixed"?: boolean;
  /** CSS classes to apply */
  "classes"?: string[];
  "status"?: "draft";
  "index"?: "yes" | "no";
};

/**
 * While these values are returned when the document is parsed
 */
export type HeaderDataValuesThatAreDynamicallyCreated = {
  /** Does this file have an associated tranlsation data file? */
  "has_data"?: Boolean;
  /** Added by References.ts in order to be printed in HeaderAndFooter.ts */
  "reflist"?: Html;
  /** Dynamically created by parsing the contents of <vocabulary/> elements */
  "vocabulary"?: string[];
}
