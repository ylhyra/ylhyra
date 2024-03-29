import { flatten, without } from "lodash";
import { types } from "inflection/tables/classification/classification";
import RenderTable from "inflection/tables/render_table";
import link, { ucfirst_link } from "inflection/tables/link";

/**
 * Finds a single relevant table
 *
 * @module Word
 * @return {string} HTML as string
 */
export default function getSingleTable({
  returnAsString,
  give_me,
  column_names,
  row_names,
  skip_description,
}) {
  let word = this;
  let description = "";
  let table = "";

  if (give_me?.length > 0) {
    word = word.get(...give_me);
  }

  if (!column_names && !row_names) {
    /* Nouns */
    if (word.is("noun")) {
      row_names = types["cases"];
    } else if (word.is("pronoun")) {
      row_names = types["cases"];
    } else if (word.is("adjective")) {
      if (word.getFirst().is("nominative")) {
        if (word.getType("degree") === "positive degree") {
          row_names = types["genders"];
        } else {
          row_names = types["degree"];
        }
      } else {
        row_names = types["cases"];
      }
    } else if (word.is("adverb") && word.getType("degree")) {
      row_names = types["degree"];
    } else if (word.is("verb")) {
      /* Temp: Needs to be merged with the principalParts file */
      /* TODO: Support generation for miðmynd */
      const word2 = this.getOriginal();
      let principalParts = [
        word2.get("infinitive").getFirstClassification(),
        word2
          .get(/*'indicative', */ "past tense", "1st person", "singular")
          .getFirstClassification(),
        word2.isStrong() &&
          word2
            .get(/*'indicative',*/ "past tense", "1st person", "plural")
            .getFirstClassification(),
        word2.get("supine").getFirstClassification(),
      ].filter(Boolean);
      row_names = principalParts;

      if (give_me?.length > 0) {
        /* The matched part is in the principal parts */
        if (
          principalParts.find((principalPart) =>
            give_me.every(
              (giveMeItem, index) => giveMeItem === principalPart[index]
            )
          )
        ) {
          /* */
        } else {
          // let row_names = ['infinitive']
          // ['infinitive', relevant_word.getType('voice')].filter(Boolean),
          if (word.getFirst().getType("person")) {
            row_names = ["infinitive", ...types["persons"]];
          } else {
            /* Nothing but infinitive and word */
            row_names = ["infinitive", give_me];
          }

          // if (relevant_word.getType('person')) {
          //   row_names = [
          //     ['infinitive', relevant_word.getType('voice')].filter(Boolean),
          //     ...types['persons'],
          //   ]
          // }
        }
      }
    }
  }

  column_names = column_names || [null];
  row_names = row_names || [null];

  if (give_me?.length > 0) {
    word = word.get(...give_me);
  } else {
    word = word.getMeetingAny(...row_names, ...column_names);
  }

  // const sibling_classification = without(word.getFirstClassification(), ...flatten(row_names), ...flatten(column_names))
  // const siblings = word.getOriginal().get(sibling_classification)

  /* As string */
  if (returnAsString) {
    return row_names
      .map((c) => word.getMostRelevantSibling(c))
      .map((i) => i.getFirstAndItsVariants().render(/*{ highlight: give_me }*/))
      .filter(Boolean)
      .join(", ");
  } else {
    /* As table */
    /* TEMPORARY; MERGE WITH ABOVE */
    const sibling_classification = without(
      word.getFirstClassification(),
      ...flatten(row_names),
      ...flatten(column_names)
    );
    const siblings = word.getOriginal().get(sibling_classification);

    table = RenderTable(
      siblings,
      word.getOriginal(),
      { column_names, row_names },
      give_me,
      {
        linkWords: true,
      }
    );
    description = ucfirst_link(
      sibling_classification.map((i) => link(i)).join(", ")
    );
    let output;
    if (description && !skip_description) {
      output = `
        ${word.renderBaseWord()}
        <div class="word_description">${word.getWordDescription()}</div>
        ${description}
        ${table}
        `;
    } else {
      output = table;
    }
    // <a href="https://inflections.ylhyra.is/${encodeURIComponent(
    //   word.getBaseWord()
    // )}/${word.getId()}">Show all</a>
    return (
      output +
      `
        <div class="table-below">
          <div class="license-small">
            <div><a href="https://ylhyra.is/project/inflections">&copy; BÍN</a></div>
          </div>
        </div>
      `
    );
  }
}
