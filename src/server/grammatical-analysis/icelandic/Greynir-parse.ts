/*
  Parses text analysis from
  [Greynir](https://greynir.is/analysis),
  a sentence analyzer for Icelandic
  by Vilhjálmur Þorsteinsson.
*/

// import default_tokenizer from 'server/api/translate/tokenizer/default-tokenizer'

export default function (text, analysis, callback) {
  if (!analysis.valid) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Invalid analysis");
      console.log(analysis);
    }
    return;
    // return default_tokenizer(text, callback)
  }

  let Sentences = [];
  let remaining = text;

  analysis.result.forEach((sentence) => {
    Sentences.push([]);
    sentence.forEach((word) => {
      if (word.err) {
        /*
          TODO!!!
          Hvað á að gerast ef ekki tókst að greina?
          Senda í default!
        */
      }
      const index = remaining.indexOf(word[TEXT]);
      if (index < 0) return;
      if (index > 0) {
        Sentences.last.push(remaining.slice(0, index));
      }
      Sentences.last.push({
        text: word[TEXT],
        analysis: {
          word_class: word[WORD_CLASS],
          grammatical_tag: word[GRAMMATICAL_TAG],
          context_free_grammar: word[CONTEXT_FREE_GRAMMAR],
          base_word: word[BASE_WORD],
          type: word[TYPE],
        },
      });
      remaining = remaining.slice(word[TEXT].length + index);
    });
  });
  callback(Sentences);
}

const TEXT = "x";
const BASE_WORD = "s"; // Inniheldur bandstrik ef orðið er samsett
const WORD_CLASS = "c"; // kk/kvk/hk, so, lo, ao, fs, st
const GRAMMATICAL_TAG = "b"; // Í BÍN.
const CONTEXT_FREE_GRAMMAR = "t"; // "fn_et_þgf_hk"
const TYPE = "k"; // WORD, PERSON, PUNCTUATION, YEAR, AMOUNT
