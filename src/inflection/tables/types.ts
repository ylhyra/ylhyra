/**  Raw list of rows with classifications from ./classification/BIN_classification.js */
export type Rows = Array<{}>;
export type Tree = {
  values: [
    {
      tag: "singular";
      values: [
        {
          tag: "nominative";
          values: [];
        }
      ];
    }
  ];
};

/** Rows as processed in ImportToDatabase.ts */
export type RawInputRows = {
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
