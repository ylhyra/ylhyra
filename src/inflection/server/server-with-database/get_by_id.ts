/*
  Note: This file currently relies on being a submodule of Ylhýra.
*/
import { classify } from "inflection/tables/classification/BIN_classification";
import { sortByClassification } from "inflection/tables/classification/sortByClassification";
import { RowFromDatabase, Rows } from "inflection/tables/types";
import query from "ylhyra/server/database";
import sql from "ylhyra/server/database/functions/SQL-template-literal";

/*
  Full table for id
*/
export default (id: number, callback: (parameter: Rows | null) => any) => {
  query(
    sql`
    SELECT
      inflection.BIN_id,
      base_word,
      inflectional_form,
      word_categories,
      BIN_domain,
      correctness_grade_of_word,
      word_register,
      grammar_group,
      cross_reference,
      should_be_taught,
      grammatical_tag,
      correctness_grade_of_inflectional_form,
      register_of_inflectional_form,
      various_feature_markers,
      alternative_entry
    FROM inflection
    WHERE inflection.BIN_id = ${id};
    -- AND correctness_grade_of_inflectional_form = 1
    -- AND should_be_taught = 1
  `,
    (err: any, results: RowFromDatabase[]) => {
      if (err) {
        callback(null);
      } else {
        try {
          const rows = results
            .map((i) => classify(i))
            .sort(sortByClassification);

          // console.log(results[1][1])
          // console.log(output)
          callback(rows);
        } catch (e) {
          console.error(e);
          callback(null);
        }
      }
    }
  );
};
