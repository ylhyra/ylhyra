export type FlattenedData = {
  translation: TranslationData;
  list: ListData;
  short_audio: {
    soundList: string[];
    sounds: {};
    wordID_to_text: {};
  };
  long_audio: {};
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

export type TokenizedParagraphsWithIds = Array<{
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
}>;
