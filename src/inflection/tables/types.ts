import { InflectionCategoryTag } from "inflection/tables/classification/classification";

export type Tree = Pick<
  Row,
  | "BIN_id"
  | "base_word"
  | "correctness_grade_of_word"
  | "word_register"
  | "word_categories"
> & {
  values: Leaf[];
};

export type Leaf = Partial<
  Pick<
    Row,
    | "inflectional_form_categories"
    | "word_categories"
    | "inflectional_form"
    | "should_be_taught"
    | "correctness_grade_of_inflectional_form"
    | "register_of_inflectional_form"
    | "formattedOutput"
  >
> & {
  tag?: InflectionCategoryTag;
  variant_number?: VariantNumber;
  values: Leaf[];
};

/** 1 is the main variant, 2 is the secondary variant, etc. */
export type VariantNumber = number;

/** Rows from database (as processed in ImportToDatabase.ts) */
export type RowFromDatabase = {
  base_word: string;
  BIN_id: string;
  word_categories: string;
  BIN_domain: string;
  correctness_grade_of_word: string;
  word_register: string;
  grammar_group: string;
  cross_reference: string;
  /** Is a part of BÍN Core or not */
  should_be_taught: Boolean;
  inflectional_form: string;
  grammatical_tag: string;
  correctness_grade_of_inflectional_form: string;
  register_of_inflectional_form: string;
  various_feature_markers: string;
  alternative_entry: string;

  /** What term of this Word matched the user's search input? */
  matched_term: string;
  /** Did this row match the user's search input? */
  variant_matched: Boolean;
};

/**  Raw list of rows with classifications from ./classification/BIN_classification.js */
export type Row = Omit<
  RowFromDatabase,
  "word_categories" | "grammatical_tag"
> & {
  /** Categories from classification.ts that apply to the entire word (noun, adjective) */
  word_categories: string[];
  /** Categories from classification.ts that apply only to the given inflectino form (nominative, dative) */
  inflectional_form_categories: InflectionalCategoryList;
  /** Cached formatted output (Todo: Is this necessary?) */
  formattedOutput?: string;
  /** Not used by this project, but returned by the API */
  original_grammatical_tag: string;
};
export type Rows = Row[];

export type Html = string;
