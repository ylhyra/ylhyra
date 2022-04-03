/*
  To run:
  node build/server/ylhyra_server.js --import-inflections
*/
import { RawInputRow } from "inflection/tables/types";
import LineByLineReader from "line-by-line";
import path from "path";
import query from "ylhyra/server/database";
import sql from "ylhyra/server/database/functions/SQL-template-literal";

let count = 0;

const CSV_FILE_NAME = "KRISTINsnid.csv";
const CSV_FILE_LINES = 6334181; // Number of lines, calculated with "wc -l"

var lr = new LineByLineReader(path.resolve(__dirname, `./${CSV_FILE_NAME}`));
lr.on("error", (err) => {
  console.error(err);
});

lr.on("line", (line) => {
  lr.pause();
  if (line.trim() === "") {
    lr.resume();
  } else {
    /*
        See https://bin.arnastofnun.is/DMII/LTdata/k-format/
      */
    let [
      base_word, // 1
      BIN_id, // 2
      word_categories, // 3
      BIN_domain, // 4  https://bin.arnastofnun.is/ordafordi/hlutiBIN/
      correctness_grade_of_word, // 5
      word_register, // 6
      grammar_group, // 7
      cross_reference, // 8
      should_be_taught, // 9 - K = Core, V = other
      inflectional_form, // 10
      grammatical_tag, // 11
      correctness_grade_of_inflectional_form, // 12
      register_of_inflectional_form, // 13
      various_feature_markers, // 14
      alternative_entry, // 15
    ]: [
      RawInputRow["base_word"],
      RawInputRow["BIN_id"],
      RawInputRow["word_categories"],
      RawInputRow["BIN_domain"],
      RawInputRow["correctness_grade_of_word"],
      RawInputRow["word_register"],
      RawInputRow["grammar_group"],
      RawInputRow["cross_reference"],
      RawInputRow["should_be_taught"],
      RawInputRow["inflectional_form"],
      RawInputRow["grammatical_tag"],
      RawInputRow["correctness_grade_of_inflectional_form"],
      RawInputRow["register_of_inflectional_form"],
      RawInputRow["various_feature_markers"],
      RawInputRow["alternative_entry"]
    ] = line.split(";");

    // if(BIN_id != 433568) {
    //   return  lr.resume()
    // }

    /* Only the words marked with "K" (meaning "Core") are prescriptive and should be taught */
    // @ts-ignore
    should_be_taught = should_be_taught === "K" ? true : false;

    query(
      sql`
        SET sql_mode="TRADITIONAL";
        INSERT INTO inflection SET
          base_word = ${base_word},
          base_word_lowercase = ${base_word.toLowerCase()},
          BIN_id = ${BIN_id},
          word_categories = ${word_categories},
          correctness_grade_of_word = ${correctness_grade_of_word || null},
          BIN_domain = ${BIN_domain},
          word_register = ${word_register},
          grammar_group = ${grammar_group},
          cross_reference = ${cross_reference || null},
          should_be_taught = ${should_be_taught},
          inflectional_form = ${inflectional_form},
          inflectional_form_lowercase = ${inflectional_form.toLowerCase()},
          grammatical_tag = ${grammatical_tag},
          correctness_grade_of_inflectional_form = ${
            correctness_grade_of_inflectional_form || null
          },
          register_of_inflectional_form = ${register_of_inflectional_form},
          various_feature_markers = ${various_feature_markers},
          alternative_entry = ${alternative_entry}
      `,
      (error) => {
        if (error) {
          console.error(error);
        }
        lr.resume();
      }
    );

    count++;
    if (count % 1000 === 1) {
      process.stdout.write(
        `\x1Bc\r${((count / CSV_FILE_LINES) * 100).toFixed(1)}% ${base_word}`
      );
    }
  }
});

lr.on("end", () => {
  process.exit();
});
