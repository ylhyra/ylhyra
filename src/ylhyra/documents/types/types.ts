import { LongAudioReducer } from "ylhyra/documents/translationEditor/audioSynchronization/types";
import {
  TokenizedParagraphs,
  TokenizedSentence,
  TokenizedWord,
} from "ylhyra/documents/types/various";

/** Data as stored in the "Data:" namespace */
export type FlattenedData = {
  translation: TranslationData;
  list: TranslationItemList;
  long_audio: LongAudioReducer;
  tokenized?: TokenizedParagraphs;
  /** NO LONGER USED */
  short_audio: {
    soundList: string[];
    sounds: {};
    wordID_to_text: {};
  };
};

export type DocumentTitleToFlattenedData = {
  [documentTitle: string]: FlattenedData;
};

export type TranslationItemList = {
  /** Used by the translator to jump to next word */
  arrayOfAllWordIDs: string[];
  sentences: Record<string, TokenizedSentence>;
  words: Record<string, TokenizedWord>;
};

export type TranslationData = {
  /* Sentence id to sentence definition */
  sentences: Record<string, SentenceDefinition>;
  /**
   * Word id to definition id.
   * Since several words can make up a single phrase,
   * multiple words can point to the same definition
   */
  words: Record<string, string>;
  /**
   * Word definition id to word definition.
   * Note: Should have been called "word definitions"
   */
  definitions: Record<string, WordDefinition>;
};

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
