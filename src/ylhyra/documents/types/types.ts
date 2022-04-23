import { LongAudioReducer } from "ylhyra/documents/translationEditor/audioSynchronization/types";
import { TranslationData } from "ylhyra/documents/types/translationTypes";
import {
  TokenizedParagraphs,
  TokenizedSentence,
  TokenizedWord,
} from "ylhyra/documents/types/various";

export type FlattenedData = {
  translation: TranslationData;
  list: TranslationList;
  long_audio: LongAudioReducer;
  tokenized?: TokenizedParagraphs;
  /** UNUSED */
  short_audio: {
    soundList: string[];
    sounds: {};
    wordID_to_text: {};
  };
};

export type DocumentTitleToFlattenedData = {
  [documentTitle: string]: FlattenedData;
};

export type TranslationList = {
  /** Array of all word IDs and all sentence IDs */
  arrayOfAllItemIDs: string[];
  arrayOfAllWordIDs: string[];
  /** Object containing all words and all sentences */
  items: Record<string, TokenizedSentence | TokenizedWord>;
  sentences: Record<string, TokenizedSentence>;
  words: Record<string, TokenizedWord>;
};
