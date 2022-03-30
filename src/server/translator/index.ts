import string_hash from "app/app/functions/hash";
import GrammaticalAnalysis from "server/grammatical-analysis";
import GetSuggestions from "server/translator/GetSuggestions";
import GoogleTranslate from "server/translator/GoogleTranslate";
import verifySession from "server/VerifyMediawikiSession";

const request = async (
  { list, tokenized, translation, suggestions, session_verification_token },
  send
) => {
  if (!list /*|| !to || !from*/) return;

  if (!list || !list.arrayOfAllWordIDs) return;
  let output = {};

  const user = await verifySession(session_verification_token);
  if (!user) {
    return; //TODO: Error message
  }

  /*
    Grammatical analysis
  */
  const analysis = await GrammaticalAnalysis(tokenized);
  // console.log(JSON.stringify(analysis))

  /*
    Our translations
  */
  let ourSuggestions = await GetSuggestions({
    list,
    tokenized,
    translation,
    suggestions,
  });
  ourSuggestions.forEach((i) => {
    output[i.item_id] = [
      ...(output[i.item_id] || []),
      {
        definition: JSON.parse(i.definition),
      },
    ];
  });

  /*
    Google Translate
  */
  if (user.groups.includes("sysop")) {
    /* Collect words needing translation */
    let translation_hashes = {};
    list.arrayOfAllWordIDs.forEach((id) => {
      if (!translation.words[id] && !output[id]) {
        const hash = string_hash(list.words[id].text);
        const text = list.words[id].text;
        translation_hashes[hash] = {
          text,
        };
      }
    });
    Object.keys(list.sentences).forEach((id) => {
      if (!translation.sentences[id] && !output[id]) {
        const hash = string_hash(list.sentences[id].text);
        const text = list.sentences[id].text;
        translation_hashes[hash] = {
          text,
        };
      }
    });

    const g = await GoogleTranslate(translation_hashes);
    list.arrayOfAllWordIDs.forEach((id) => {
      const hash = string_hash(list.words[id].text);
      // const text = list.words[id].text
      if (g[hash]) {
        output[id] = [
          {
            definition: {
              meaning: g[hash],
            },
          },
        ];
      }
    });
    Object.keys(list.sentences).forEach((id) => {
      const hash = string_hash(list.sentences[id].text);
      // const text = list.sentences[id].text
      if (g[hash]) {
        output[id] = [
          {
            definition: {
              meaning: g[hash],
            },
          },
        ];
      }
    });
  }

  send({
    type: "SUGGEST",
    definitions: output,
    analysis,
  });
};

export default request;
