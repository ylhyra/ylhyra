import hash from "modules/hash";
import _ from "underscore";
import CreateIDs from "ylhyra/documents/compilation/compileWithTranslation/Tokenize/IDs/CreateIDs";
import PreserveIDs from "ylhyra/documents/compilation/compileWithTranslation/Tokenize/IDs/PreserveIDs";
import tokenizer from "ylhyra/documents/compilation/compileWithTranslation/Tokenize/Tokenizer";
import {
  DocumentTitleToArrayOfRawText,
  DocumentTitleToFlattenedData,
  DocumentTitleToTokenizedParagraphsWithIds,
  FlattenedData,
  ParagraphsWithHash,
  RawTokenizedParagraphs,
  TokenizedParagraphsWithIds,
} from "ylhyra/documents/types";

export default function (
  documents: DocumentTitleToArrayOfRawText,
  data: DocumentTitleToFlattenedData
): DocumentTitleToTokenizedParagraphsWithIds {
  let tokenized: DocumentTitleToTokenizedParagraphsWithIds = {};
  for (const documentTitle of Object.keys(documents)) {
    tokenized[documentTitle] = tokenizeDocument({
      documentTitle,
      paragraphs: documents[documentTitle],
      previousData: data[documentTitle] || ({} as FlattenedData),
    });
  }
  return tokenized;
}

const tokenizeDocument = ({
  documentTitle,
  paragraphs,
  previousData,
}: {
  documentTitle: string;
  paragraphs: ParagraphsWithHash;
  previousData: FlattenedData;
}) => {
  const oldHashes = previousData.tokenized?.map((p) => p.hash) || [];

  /*
    Step 1: Tokenize all paragraphs that don't already have a tokenization saved
  */
  const paragraphsMissingTokenization = _.uniq(
    paragraphs.filter((p) => !oldHashes.includes(p.hash))
  );
  let tokenizedRaw: RawTokenizedParagraphs = tokenizer(
    paragraphsMissingTokenization
  );

  /*
    Step 2: Merge the new tokenizations with the previously calculated ones.
    We make sure to maintain the `index` order that already exists on the paragraph.
  */
  const arrayOfNewAndOldTokenizations = [
    ...(previousData.tokenized || []), // Previous tokenization
    ...tokenizedRaw, // New tokenization
  ];
  tokenizedRaw = paragraphs.map((p) => {
    return {
      ...arrayOfNewAndOldTokenizations.find((i) => i.hash === p.hash),
      index: p.index,
    };
  }) as RawTokenizedParagraphs;

  let tokenizedWithIds: TokenizedParagraphsWithIds = CreateIDs(
    documentTitle,
    tokenizedRaw
  );
  if (previousData.tokenized) {
    tokenizedWithIds = PreserveIDs(previousData.tokenized, tokenizedWithIds);
  }

  /*
    "Paragraph" currently only contains a hash of the text.
    Here we add a hash of the IDs
  */
  tokenizedWithIds = tokenizedWithIds.map((paragraph) => ({
    ...paragraph,
    hashOfIds: hashOfIds(paragraph),
  }));

  return tokenizedWithIds;
};

const hashOfIds = (paragraph: TokenizedParagraphsWithIds[number]) => {
  let ids: string[] = [];
  paragraph.sentences.forEach((sentence) => {
    ids.push(sentence.id);
    sentence.words.forEach((word) => {
      if (typeof word !== "string") {
        ids.push(word.id);
      }
    });
  });
  return hash(ids);
};
