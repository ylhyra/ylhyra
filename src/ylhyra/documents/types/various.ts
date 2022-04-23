export type TokenizedParagraph = {
  /** Used to keep track of our location in the paragraph extraction */
  index?: number;
  hash: string;
  sentences: TokenizedSentence[];
};
export type TokenizedParagraphs = Array<TokenizedParagraph>;

export type TokenizedSentence = {
  id: string;
  text: string;
  words: TokenizedWord[];
};

/** Punctuation is only a string, while words are objects with id and text. */
export type TokenizedWord =
  | {
      id: string;
      text: string;
      /** Only a part of the output of TranslationList, not a part of the tokenization output */
      belongsToSentence?: string;
    }
  | string;

export type DocumentTitleToTokenizedParagraphsWithIds = {
  [documentTitle: string]: TokenizedParagraphs;
};

export type ArrayOfEitherTokenizedSentencesOrWords =
  | TokenizedParagraph["sentences"]
  | TokenizedParagraph["sentences"][number]["words"];

/**
 * Used in WrapInTags.
 * By flattening, we can keep track of multiple transcluded documents.
 */
export type TokenizedFlattenedForWrapInTags = Array<
  {
    documentTitle: string;
    // index: number; // Needed here since index is optional on TokenizedParagraphWithIds
  } & TokenizedParagraph
>;

/** Returned from ExtractText */
export type DocumentTitleToRawParagraphs = {
  [documentTitle: string]: RawParagraphsWithHash;
};

export type RawParagraphsWithHash = Array<{
  index: number;
  hash: string;
  /** Raw text */
  text: string;
}>;

export type RawTokenizedParagraphs = Array<{
  index?: number;
  hash: string;
  /** Array of sentences containing an array of raw words as string */
  sentences: Array<Array<string>>;
}>;
