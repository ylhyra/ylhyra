import hash from "app/app/functions/hash";
import CreateIDs from "documents/parse/Tokenize/IDs/CreateIDs";
import PreserveIDs from "documents/parse/Tokenize/IDs/PreserveIDs";
import tokenizer from "documents/parse/Tokenize/Tokenizer";
import {
  DocumentTitleToArrayOfRawText,
  DocumentTitleToFlattenedData,
  FlattenedData,
  ParagraphsWithHash,
  RawTokenizedParagraphs,
} from "documents/parse/types";
import _ from "underscore";

export default function (
  documents: DocumentTitleToArrayOfRawText,
  data: DocumentTitleToFlattenedData
) {
  let tokenized = {};
  for (const documentTitle of Object.keys(documents)) {
    tokenized[documentTitle] = tokenizeDocument({
      documentTitle,
      paragraphs: documents[documentTitle],
      previousData: data[documentTitle] || {},
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
  previousData: FlattenedData | {};
}) => {
  const oldHashes = previousData.tokenized?.map((p) => p.hash) || [];

  /*
    We do not want to unnecessarily recalculate tokenization.
  */
  const paragraphsMissingTokenization = _.uniq(
    paragraphs.filter((p) => !oldHashes.includes(p.hash))
  );

  let tokenized: RawTokenizedParagraphs = tokenizer(
    paragraphsMissingTokenization
  );

  /*
    Since we only calculated tokenization for things that have changed,
    here we merge the output with previously calculated tokenizations.
  */
  const arrayOfNewAndOldTokenizations = [
    ...(previousData.tokenized || []), // Previous tokenization
    ...tokenized, // New tokenization
  ];
  tokenized = paragraphs.map((p) => {
    return {
      ...arrayOfNewAndOldTokenizations.find((i) => i.hash === p.hash),
      index: p.index,
    };
  });
  tokenized = CreateIDs(documentTitle, tokenized);
  if (previousData.tokenized) {
    tokenized = PreserveIDs(previousData.tokenized, tokenized);
  }

  /*
    "Paragraph" currently only contains a hash of the text.
    Here we add a hash of the IDs
  */
  tokenized = tokenized.map((paragraph) => ({
    ...paragraph,
    hashOfIds: hashOfIds(paragraph),
  }));

  return tokenized;
};

const hashOfIds = (paragraph) => {
  let ids = [];
  paragraph.sentences.forEach((sentence) => {
    ids.push(sentence.id);
    sentence.words.forEach((word) => {
      ids.push(word.id);
    });
  });
  return hash(ids);
};
