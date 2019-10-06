/*
  _____     _              _
 |_   _|__ | | _____ _ __ (_)_______
   | |/ _ \| |/ / _ \ '_ \| |_  / _ \
   | | (_) |   <  __/ | | | |/ /  __/
   |_|\___/|_|\_\___|_| |_|_/___\___|

  1. Extracts raw text from input
  2. Sends text to server for tokenization
*/

import _ from 'underscore'
import CreateIDs from './IDs/CreateIDs'
import hash from 'App/functions/hash'
import PreserveIDs from './IDs/PreserveIDs'
import tokenizer from './Tokenizer'

export default function(documents, data) {
  let tokenized = {}
  for (const documentTitle of Object.keys(documents)) {
    tokenized[documentTitle] = tokenize({
      paragraphs: documents[documentTitle],
      previousData: data[documentTitle] || {}
    })
  }
  return tokenized
}

const tokenize = ({ paragraphs, previousData }) => {
  const oldHashes = previousData.tokenized?.map(p => p.hash) || []

  /*
    We do not want to unnecessarily recalculate tokenization.
  */
  const paragraphsMissingTokenization = _.uniq(paragraphs.filter(p => !oldHashes.includes(p.hash)))

  let tokenized = tokenizer({ paragraphs: paragraphsMissingTokenization })

  /*
    Since we only calculated tokenization for things that have changed,
    here we merge the output with previously calculated tokenizations.
  */
  const arrayOfNewAndOldTokenizations = [
    ...(previousData.tokenized || []), // Previous tokenization
    ...tokenized, // New tokenization
  ]
  tokenized = paragraphs.map(p => {
    return {
      ...arrayOfNewAndOldTokenizations.find(i => i.hash === p.hash),
      index: p.index,
    }
  })
  // console.log(tokenized)
  tokenized = CreateIDs(tokenized)
  if(previousData.tokenized) {
    tokenized = PreserveIDs(previousData.tokenized, tokenized)
  }

  /*
    "Paragraph" currently only contains a hash of the text.
    Here we add a hash of the IDs
  */
  tokenized = tokenized.map(paragraph => ({
    ...paragraph,
    hashOfIds: hashOfIds(paragraph),
  }))

  return tokenized
}

const hashOfIds = (paragraph) => {
  let ids = []
  paragraph.sentences.forEach(sentence => {
    ids.push(sentence.id)
    sentence.words.forEach(word => {
      ids.push(word.id)
    })
  })
  return hash(ids)
}
