import axios from 'axios'
const url = process.env.NODE_ENV === 'development' ? 'https://localhost:8000' : ''

export const suggestions = (state = {}, action) => {
  let update = {}
  switch (action.type) {
    case 'INITIALIZE_WITH_TOKENIZED_AND_DATA':
      // console.warn(action)
      return action.currentDocumentData?.suggestions || {}
    case 'SUGGEST':
      /* Suggest translation */
      Object.keys(action.definitions).forEach(id => {
        update[id] = [
          ...(state[id] || []),
          ...(action.definitions[id] || []),
        ]
      })
      return {
        ...state,
        ...update,
      }
    default:
      return state
  }
}

export const analysis = (state = {}, action) => {
  let update = {}
  switch (action.type) {
    case 'INITIALIZE_WITH_TOKENIZED_AND_DATA':
      return action.currentDocumentData?.analysis || {}
    case 'SUGGEST':
      /* Suggest analysis */
      action.analysis.forEach(async (item, index) => {
        /* Temporary, only allow one word at a time */
        if (!item.ids || item.ids.length > 1) return;
        const id = item.ids[0]
        if(!id) return;
        const analysis = item.analysis[0].analysis

        // if (index < 2) {
        const data = (await axios.post(`${url}/api/inflection/find_inflection_id`, {
          analysis: item.analysis[0]
        })).data

        /*
          TODO: Currently only fetches one match.
          Should show more bin leaf matches and ALSO more options inside each word
        */

        const BIN_id = data.length > 0 && data[0].BIN_id

        update[id] = {
          ...(state[id] || {}),
          ...analysis,
          BIN_id,
        }
      })
      return {
        ...state,
        ...update,
      }
    default:
      return state
  }
}

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
