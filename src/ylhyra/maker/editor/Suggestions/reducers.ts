export const suggestions = (state = {}, action) => {
  let update = {};
  switch (action.type) {
    case "INITIALIZE_WITH_TOKENIZED_AND_DATA":
      // console.warn(action)
      return action.currentDocumentData?.suggestions || {};
    case "SUGGEST":
      /* Suggest translation */
      Object.keys(action.definitions).forEach((id) => {
        update[id] = [...(state[id] || []), ...(action.definitions[id] || [])];
      });
      return {
        ...state,
        ...update,
      };
    default:
      return state;
  }
};

export const analysis = (state = {}, action) => {
  switch (action.type) {
    case "INITIALIZE_WITH_TOKENIZED_AND_DATA":
      return action.currentDocumentData?.analysis || {};
    case "GRAMMATICAL_ANALYSIS":
      return {
        ...state,
        ...action.grammatical_analysis,
      };
    default:
      return state;
  }
};

/*
Analysis is returned on the form:

[{
 "ids": ["w_t7ra1"],
 "analysis": [{
   "text": "Við",
   "analysis": {
     "part_of_speech": "pfn",
     "inflection_form": "NFFT",
     "context_free_grammar": "pfn_ft_nf",
     "base_word": "ég",
     "type": "WORD"
   }
 }]
}, {
 "ids": ["w_t7ra2"],
 "analysis": [{
   "text": "sjáumst",
   "analysis": {
     "part_of_speech": "so",
     "inflection_form": "MM-FH-NT-1P-FT",
     "context_free_grammar": "so_0_ft_p1",
     "base_word": "sjá",
     "type": "WORD"
   }
 }]
}]
*/
