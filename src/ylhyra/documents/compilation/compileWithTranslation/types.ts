export type SentenceDefinition = {
  /** A translation of sentence that should convey most of the sentence’s nuances. */
  meaning?: string;
  /** Direct translation of sentence. */
  direct?: string;
  /** Explains cultural connotations. */
  note?: string;
};
export type WordDefinition = {
  /** Word translation that should convey most of the meaning. */
  meaning: string;
  /** Icelandic base version of word (without inflections). */
  base?: string;
  /** Translation of the base version (without inflections). */
  base_meaning?: string;
  /** Translation of the base version, if necessary. */
  base_direct?: string;
  /** Explains cultural connotations. */
  note?: string;
  /** Direct translation of word. */
  direct?: string;
  difficult?: Boolean;
  /** Array of connected word ids */
  contains: string[];
  show_definition_above?: Boolean;
  /** If`show_definition_above` is selected, `inline_translation` will be shown above it. If `inline_translation` is empty, `meaning` will be shown. */
  inline_translation?: string;
  /** UNUSED */
  grammatical_analysis?: string;
  /** UNUSED */
  sound?: string[];
  /** UNUSED */
  pronunciation?: string;
};
