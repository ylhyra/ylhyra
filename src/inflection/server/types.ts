import {
  GrammaticalTag,
  Html,
  InflectionalCategoryList,
  Rows,
  Tree,
} from "inflection/tables/types";

export type MainSearch =
  | {
      id: number;
      type: "flat" | "html" | "json" | undefined;
      search: SearchOptions["word"];
    } & SearchOptions;

export type WebsiteSearch = {
  embed: Boolean;
  id: number;
  word: string;
} & TableOptionsFromUser;

export type SearchOptions = {
  word: string;
  return_rows_if_only_one_match?: Boolean;
  fuzzy?: Boolean;
};

export type SearchFunction = (
  options: SearchOptions,
  callback: (parameter: PossibleSearchReturns) => any
) => any;

export type FuzzySearchReturns = {
  perfect_matches: FuzzySearchOutputObject[];
  did_you_mean: FuzzySearchOutputObject[];
};
export type FuzzySearchOutputObject = {
  perfect_match: Boolean;
  BIN_id: string;
  base_word: string;
  description: string;
  snippet: Html;
  matched_term: string;
  rows: Rows;
};

export type SearchReturnObject = {
  BIN_id: string;
  urls: {
    nested: string;
    flat: string;
    html: string;
  };
  base_word: string;
  word_categories: GrammaticalTag[];
  matches: Array<{
    inflectional_form: string;
    inflectional_form_categories: InflectionalCategoryList;
    should_be_taught: Boolean;
  }>;
};

export type PossibleSearchReturns =
  | SearchReturnObject[]
  | FuzzySearchReturns
  | null
  | "Error";

export type OutputWithLicense = {
  results: Tree | Rows | null;
  license: string;
};

export type TableOptionsFromUser = {
  single?: Boolean;
  /** Is converted into InflectionalCategoryList before being sent to tables_single */
  column_names?: string;
  columns?: string;
  row_names?: string;
  rows?: string;
  give_me?: string;
};
