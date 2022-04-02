import { Second } from "modules/time";

export type FlattenedData = {
  translation: TranslationData;
  list: ListData;
  short_audio: {
    soundList: string[];
    sounds: {};
    wordID_to_text: {};
  };
  long_audio: {
    [filename: string]: {
      sync: {
        list: LongAudioSyncData[];
      };
    };
  };

  tokenized?: TokenizedParagraphsWithIds;
};

export type AeneasOutput = {
  fragments: Array<{
    id: "root";
    /** Sentence-level elements */
    children: Array<{
      begin: string;
      end: string;
      id: string;
      /** Word-level elements */
      children?: Array<{
        begin: string;
        end: string;
        id: string;
      }>;
    }>;
  }>;
};

export type UnprocessedLongAudioSyncData = {
  begin: Second;
  end: Second;
  id: string;
};

export type LongAudioSyncData = {
  begin: Second;
  end: Second;
  /**
   * Elements that are highlighted during this time
   */
  elements: string[];
};

export type DocumentTitleToFlattenedData = {
  [documentTitle: string]: FlattenedData;
};

export type TranslationData = {
  definitions: {};
  sentences: {};
  words: {};
};

export type ListData = {
  /** Array of all word IDs and all sentence IDs */
  arrayOfAllItemIDs: string[];
  arrayOfAllWordIDs: string[];
  /** Object containing all words and all sentences */
  items: {};
  sentences: { [sentenceId: string]: Object };
  words: {};
};

export type DocumentTitleToArrayOfRawText = {
  [documentTitle: string]: ParagraphsWithHash;
};

export type ParagraphsWithHash = Array<{
  index: number;
  hash: string;
  text: string;
}>;

export type RawTokenizedParagraphs = Array<{
  index?: number;
  hash: string;
  sentences: Array<Array<string>>;
}>;

export type TokenizedParagraphWithIds = {
  index?: number;
  hash: string;
  sentences: Array<{
    id: string;
    text: string;
    words: Array<
      | {
          id: string;
          text: string;
        }
      | string
    >;
  }>;
};
export type TokenizedParagraphsWithIds = Array<TokenizedParagraphWithIds>;
export type DocumentTitleToTokenizedParagraphsWithIds = {
  [documentTitle: string]: TokenizedParagraphsWithIds;
};
export type ArrayOfEitherSentencesOrWords =
  | TokenizedParagraphWithIds["sentences"]
  | TokenizedParagraphWithIds["sentences"][number]["words"];

export type TokenizedFlattenedForWrapInTags = Array<
  {
    documentTitle: string;
    // index: number; // Needed here since index is optional on TokenizedParagraphWithIds
  } & TokenizedParagraphWithIds
>;
