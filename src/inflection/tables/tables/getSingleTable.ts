import { getOrderedGrammaticalCategories } from "inflection/tables/classification/classification";
import link, { uppercaseFirstLetterLink } from "inflection/tables/link";
import { renderTableWrapperForSmallScreens as renderTable } from "inflection/tables/tables/render/renderTableWrapper";
import {
  GrammaticalTag,
  Html,
  InflectionalCategoryList,
  InflectionalCategoryListOrNestedList,
} from "inflection/tables/types";
import Word from "inflection/tables/word";
import { without } from "lodash";
import flattenArray from "modules/flattenArray";

export type SingleTableOptions = {
  returnAsString?: Boolean;
  give_me?: InflectionalCategoryList;
  column_names?: InflectionalCategoryListOrNestedList;
  row_names?: InflectionalCategoryListOrNestedList;
  skip_description?: Boolean;
};

/**
 * Finds a single relevant table
 */
export default function getSingleTable(
  this: Word,
  {
    returnAsString,
    give_me,
    column_names,
    row_names,
    skip_description,
  }: SingleTableOptions
): Html {
  let word = this;
  let description = "";
  let table = "";

  if (give_me && give_me.length > 0) {
    word = word.get(...give_me);
  }

  if (!column_names && !row_names) {
    /* Nouns */
    if (word.is("noun")) {
      row_names = getOrderedGrammaticalCategories("cases");
    } else if (word.is("pronoun")) {
      row_names = getOrderedGrammaticalCategories("cases");
    } else if (word.is("adjective")) {
      if (word.getFirst().is("nominative")) {
        if (word.getType("degree") === "positive degree") {
          row_names = getOrderedGrammaticalCategories("genders");
        } else {
          row_names = getOrderedGrammaticalCategories("degree");
        }
      } else {
        row_names = getOrderedGrammaticalCategories("cases");
      }
    } else if (word.is("adverb") && word.getType("degree")) {
      row_names = getOrderedGrammaticalCategories("degree");
    } else if (word.is("verb")) {
      /* Temp: Needs to be merged with the principalParts file */
      /* TODO: Support generation for miðmynd */
      const word2 = this.getOriginal();
      let principalParts = [
        word2.get("infinitive").getClassificationOfFirstRow(),
        word2
          .get(/*'indicative', */ "past tense", "1st person", "singular")
          .getClassificationOfFirstRow(),
        word2.isStrong() &&
          word2
            .get(/*'indicative',*/ "past tense", "1st person", "plural")
            .getClassificationOfFirstRow(),
        word2.get("supine").getClassificationOfFirstRow(),
      ].filter(Boolean) as GrammaticalTag[][];
      row_names = principalParts;

      if (give_me && give_me.length > 0) {
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
            row_names = [
              "infinitive",
              ...getOrderedGrammaticalCategories("persons"),
            ];
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

  if (give_me && give_me.length > 0) {
    word = word.get(give_me);
  } else {
    word = word.getMeetingAny(row_names, column_names);
  }

  // const sibling_classification = without(word.getClassificationOfFirstRow(), ...flatten(row_names), ...flatten(column_names))
  // const siblings = word.getOriginal().get(sibling_classification)

  /* As string */
  if (returnAsString) {
    return row_names
      .map((c) => word.getMostRelevantSibling(c))
      .map((i) =>
        i
          .getFirstAndItsVariants()
          .renderWithHelperWords(/*{ highlight: give_me }*/)
      )
      .filter(Boolean)
      .join(", ");
  } else {
    /* As table */
    /* TEMPORARY; MERGE WITH ABOVE */
    const siblingClassification = without(
      word.getClassificationOfFirstRow(),
      ...flattenArray(row_names),
      ...flattenArray(column_names)
    ) as GrammaticalTag[];
    const siblings = word.getOriginal().get(...siblingClassification);

    table = renderTable(
      siblings,
      word.getOriginal(),
      { column_names, row_names },
      give_me,
      {
        linkWords: true,
      }
    );
    description = uppercaseFirstLetterLink(
      siblingClassification.map((i) => link(i)).join(", ")
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
