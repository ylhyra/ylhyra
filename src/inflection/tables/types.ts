export type Tree = Pick<
  Row,
  | "BIN_id"
  | "base_word"
  | "correctness_grade_of_word"
  | "word_register"
  | "word_categories"
> & {
  values: TreeItems;
};

export type TreeItem = Partial<Branch & Leaf>;
export type Branch = {
  tag: GrammaticalTag;
  values: TreeItems;
};
// export type Leaf = Pick<
//   Row,
//   | "inflectional_form_categories"
//   | "word_categories"
//   | "inflectional_form"
//   | "should_be_taught"
//   | "correctness_grade_of_inflectional_form"
//   | "register_of_inflectional_form"
//   | "formattedOutput"
//   | "variant_number"
//   >;
export type Leaf = Row;
export type Leafs = Leaf[];
export type TreeItems = TreeItem[];

/** 1 is the main variant, 2 is the secondary variant, etc. */
export type VariantNumber = number;
export const PRIMARY_VARIANT_NUMBER = 1;

export enum CorrectnessGrade {
  /** The word can be used in any context and any style or register. */
  Default = 1,
  /** The word is not universally accepted, at least not in the most formal of registers. */
  Used = 2,
  /** Not accepted. */
  Not_accepted = 3,
  /** Error, unacceptable. */
  Error = 4,
  /** The word is not used in ordinary context in Modern Icelandic. */
  Obsolete = 5,
}

/**
 * Rows from database (as processed in ImportToDatabase.ts)
 * See https://bin.arnastofnun.is/DMII/LTdata/k-format/
 * */
export type RowFromDatabase = {
  base_word: string;
  BIN_id: string;
  word_categories: string;
  BIN_domain: string;
  correctness_grade_of_word: CorrectnessGrade;
  correctness_grade_of_inflectional_form: CorrectnessGrade;
  word_register: string;
  grammar_group: string;
  cross_reference: string;
  /** Is a part of BÍN Core or not */
  should_be_taught: Boolean;
  inflectional_form: string;
  grammatical_tag: string;
  register_of_inflectional_form: string;
  various_feature_markers: string;
  alternative_entry: string;

  /** Database search: What term of this Word matched the user's search input? */
  matched_term: string;
  /** Database search: Exact match? */
  word_has_perfect_match: Boolean;
  /** Did this row match the user's search input? */
  variant_matched: Boolean;
};

/**  Raw list of rows with classifications from ./classification/BIN_classification.js */
export type Row = Omit<
  RowFromDatabase,
  "word_categories" | "grammatical_tag"
> & {
  /** Categories from classification.ts that apply to the entire word (noun, adjective) */
  word_categories: GrammaticalTag[];

  /** Categories from classification.ts that apply only to the given inflection form (nominative, dative) */
  inflectional_form_categories: InflectionalCategoryList;

  /** Cached formatted output with umlauts highlighted */
  formattedOutput?: string;

  /** Not used by this project, but returned by the API */
  original_grammatical_tag: string;

  variant_number?: VariantNumber;
};
export type Rows = Row[];

export type Html = string;

export type GrammaticalCategory =
  | "article"
  | "articles"
  | "case"
  | "cases"
  | "degree"
  | "gender"
  | "genders"
  | "number"
  | "person"
  | "persons"
  | "plurality"
  | "strong or weak"
  | "tense"
  | "word_class"
  | "";
export type GrammaticalTag = string;
export type GrammaticalTagOrVariantNumber = GrammaticalTag | VariantNumber;
export type InflectionalCategoryList = GrammaticalTagOrVariantNumber[];
