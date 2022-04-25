import { sortByArray } from "modules/sortByArray";
import { AnyAction } from "redux";
import { omit, uniq } from "underscore";
import { wordsHash } from "ylhyra/documents/translationEditor/main/translator/actions";
import { TranslationData, WordDefinition } from "ylhyra/documents/types/types";

export const selected = (state: string[] = [], action: AnyAction) => {
  switch (action.type) {
    case "SELECT_WORD":
      // Eru mörg orð í þessu vali?
      if (action.contains) {
        return action.contains;
      } else if (action.id) {
        if (action.adding) {
          const arrayOfAllWordIDs = action.arrayOfAllWordIDs;
          return sortByArray(
            (state = uniq([action.id, ...state])),
            arrayOfAllWordIDs
          );
        } else {
          return (state = [action.id]);
        }
      }
      return state;
    case "CLEAR_SELECTION":
    case "CONFIRM_DEFINITION":
    case "DELETE_WORD":
      return (state = []);
    default:
      return state;
  }
};

const emptyTranslationData: TranslationData = {
  sentences: {},
  words: {},
  definitions: {},
};

export const translation = (
  state: TranslationData = emptyTranslationData,
  action: AnyAction
) => {
  switch (action.type) {
    case "INITIALIZE_WITH_TOKENIZED_AND_DATA":
      if (action.currentDocumentData) {
        return action.currentDocumentData.translation as TranslationData;
      } else {
        return emptyTranslationData;
      }

    case "UPDATE_SENTENCE": {
      let { sentence_id, content } = action;
      return {
        ...state,
        sentences: {
          ...state.sentences,
          [sentence_id]: content,
        },
      } as TranslationData;
    }

    case "UPDATE_SENTENCE_VALUE": {
      let { sentence_id, fieldName, value } = action;
      /* If user has deleted definition */
      if (!value) {
        let sentence = state.sentences[sentence_id] || {};
        sentence = omit(sentence, fieldName); // Clear field
        /* Is entire definition empty? */
        if (Object.keys(sentence).length === 0) {
          /* Return object without sentence */
          let sentences = state.sentences;
          sentences = omit(
            sentences,
            sentence_id
          ) as TranslationData["sentences"]; // Clear field
          return {
            ...state,
            sentences,
          } as TranslationData;
        } else {
          /* Return sentence without the deleted field */
          return {
            ...state,
            sentences: {
              ...state.sentences,
              [sentence_id]: sentence,
            },
          } as TranslationData;
        }
      }
      return {
        ...state,
        sentences: {
          ...state.sentences,
          [sentence_id]: {
            ...(state.sentences[sentence_id] || {}),
            [fieldName]: value,
          },
        },
      } as TranslationData;
    }

    /*
        Update entire definition
      */
    case "UPDATE_DEFINITION": {
      const { definition, selected } = action;
      const hash = wordsHash(selected);
      let words: Record<string, string> = {};
      for (let id of selected) {
        words[id as string] = hash;
      }
      return {
        ...state,
        words: {
          ...state.words,
          ...words,
        },
        definitions: {
          ...state.definitions,
          [hash]: {
            contains: selected,
            ...definition,
          },
        },
      } as TranslationData;
    }

    /*
        Update just one field in definition
      */
    case "UPDATE_DEFINITION_VALUE": {
      const { name, value, selected } = action;
      const hash = wordsHash(selected);
      let words: Record<string, string> = {};
      for (let id of selected) {
        words[id] = hash;
      }
      /* If user has deleted definition */
      if (!value) {
        let definition = state.definitions[hash];
        definition = omit(definition, name) as WordDefinition; // Clear field
        /* Is entire definition empty? */
        if (Object.keys(definition).length <= 1) {
          /* Return object without word */
          return {
            ...state,
            words: omit(state.words, ...selected),
            definitions: omit(state.definitions, hash),
          } as TranslationData;
        } else {
          /* Return word without the deleted field */
          return {
            ...state,
            words: {
              ...state.words,
              ...words,
            },
            definitions: {
              ...state.definitions,
              [hash]: {
                ...definition,
                contains: selected,
              },
            },
          } as TranslationData;
        }
      }
      return {
        ...state,
        words: {
          ...state.words,
          ...words,
        },
        definitions: {
          ...state.definitions,
          [hash]: {
            ...state.definitions[hash],
            contains: selected,
            [name]: value,
          },
        },
      } as TranslationData;
    }

    case "DELETE_WORD": {
      const words = state.words;
      const definitions = state.definitions;
      const definitionId = words[action.id];
      const definition = definitions[definitionId];

      if (!definition) {
        return state;
      }
      definition.contains.forEach((word) => {
        delete words[word];
      });
      delete definitions[definitionId];
      return {
        ...state,
        words: {
          ...words,
        },
        definitions: {
          ...definitions,
        },
      } as TranslationData;
    }

    default:
      return state;
  }
};
