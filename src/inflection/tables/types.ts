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

export type Leaf = Pick<
  Row,
  | "inflectional_form_categories"
  | "word_categories"
  | "inflectional_form"
  | "should_be_taught"
  | "correctness_grade_of_inflectional_form"
  | "register_of_inflectional_form"
  | "formattedOutput"
> & {
  tag?: string;
  variant_number: number;
  values: Leaf[];
};

/** Rows from database (as processed in ImportToDatabase.ts) */
export type RawInputRow = {
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
};

/**  Raw list of rows with classifications from ./classification/BIN_classification.js */
export type Row = Omit<
  RawInputRow,
  "word_categories" | "grammatical_tag" | "BIN_domain"
> & {
  /** Categories from classification.ts that apply to the entire word (noun, adjective) */
  word_categories: string[];
  /** Categories from classification.ts that apply only to the given inflectino form (nominative, dative) */
  inflectional_form_categories: string[];

  /** Cached formatted output (Todo: Is this necessary?) */
  formattedOutput?: string;
};
export type Rows = Row[];
