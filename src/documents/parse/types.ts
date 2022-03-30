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

export type TranslationData = {
  definitions: {};
  sentences: {};
  words: {};
};

export type ListData = {
  arrayOfAllItemIDs: string[];
  arrayOfAllWordIDs: string[];
  items: {};
  sentences: {};
  words: {};
};
