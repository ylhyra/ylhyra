// /*
//   Note: This file currently relies on being a submodule of Ylhýra.
// */
// 
import express from 'express'

// const router = express.Router()
// import query from 'server/database'
// import sql from 'server/database/functions/SQL-template-literal'
// /*
//   Input: Grammatical analysis from Greynir for a word
//   Output: BIN id
//
//   Input is on the form:
//   analysis: {
//     "text": "Þetta",
//     "analysis": {
//       "part_of_speech": "fn",
//       "inflection_form": "HK-NFET",
//       "context_free_grammar": "fn_et_nf_hk",
//       "base_word": "þessi",
//       "type": "WORD"
//     }
//   }
//
// */
//
// router.post('/inflection/find_inflection_id', (req, res) => {
//   const { analysis } = req.body
//   const word_categories = analysis.analysis.word_categories
//   const grammatical_tag = analysis.analysis.grammatical_tag
//   if(!analysis.analysis.base_word) {
//     console.log(analysis)
//     res.status(400)
//     res.send('No "base_word"')
//     return
//   }
//
//   query(sql `
//     SELECT * FROM inflection
//     WHERE inflectional_form_lowercase = ${analysis.text.toLowerCase()}
//     -- AND base_word_lowercase = ${analysis.analysis.base_word.toLowerCase()}
//     -- AND word_categories = ${word_categories}
//     -- AND grammatical_tag = ${grammatical_tag}
//     ORDER BY
//     correctness_grade_of_inflectional_form DESC,
//     should_be_taught DESC,
//     base_word_lowercase = ${analysis.analysis.base_word.toLowerCase()} DESC,
//     word_categories = ${word_categories} DESC,
//     grammatical_tag = ${grammatical_tag} DESC
//   `, (err, results) => {
//     if (err) {
//       res.send(err)
//     } else {
//       res.send(JSON.stringify(results, null, 2))
//
//     }
//   })
// })
// export default router;
