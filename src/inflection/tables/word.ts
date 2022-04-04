import { relevant_BIN_domains } from "inflection/tables/classification/BIN_classification";
import {
  getCanonicalGrammaticalTag,
  getDescriptionFromGrammaticalTag,
  grammaticalCategories,
} from "inflection/tables/classification/classification";
import { discardUnnecessaryForms } from "inflection/tables/functions/discard";
import {
  getHelperWordsAfter,
  getHelperWordsBefore,
} from "inflection/tables/functions/helperWords";
import { findIrregularities } from "inflection/tables/functions/irregularities";
import { getPrincipalParts } from "inflection/tables/functions/principalParts";
import { getSnippet } from "inflection/tables/functions/snippet";
import { getStem } from "inflection/tables/functions/stem";
import { isStrong, isWeak } from "inflection/tables/functions/strong";
import { getWordDescription } from "inflection/tables/functions/wordDescription";
import { getWordNotes } from "inflection/tables/functions/wordNotes";
import getTables from "inflection/tables/tables_all";
import getSingleTable from "inflection/tables/tables_single";
import { isNumber, tree } from "inflection/tables/tree";
import {
  GrammaticalCategory,
  GrammaticalTag,
  GrammaticalTagOrVariantNumber,
  Html,
  InflectionalCategoryList,
  Leafs,
  Rows,
} from "inflection/tables/types";
import { flatten } from "lodash";
import { filterEmpty } from "modules/typescript/filterEmpty";

class Word {
  /** The original Word object without any removed values */
  original: Word;
  isStrong_cached?: Boolean;
  rows: Rows;
  wordHasUmlaut?: Boolean;
  wordIsIrregular?: Boolean;
  wordIsHighlyIrregular?: Boolean;

  getHelperWordsBefore = getHelperWordsBefore;
  getHelperWordsAfter = getHelperWordsAfter;
  getPrincipalParts = getPrincipalParts;
  getStem = getStem;
  isStrong = isStrong;
  isWeak = isWeak;
  getTables = getTables;
  getSingleTable = getSingleTable;
  getWordDescription = getWordDescription;
  getWordNotes = getWordNotes;
  findIrregularities = findIrregularities;
  getSnippet = getSnippet;

  constructor(rows: Rows | Leafs = [], original?: Word) {
    if (!Array.isArray(rows) && rows !== undefined) {
      throw new Error(
        `Class "Word" expected parameter "rows" to be an array or undefined, got ${typeof rows}`
      );
    }

    /* Test for broken input */
    if (!original) {
      if (
        !rows.every((row) => {
          return (
            typeof row === "object" && "inflectional_form_categories" in row
          );
        })
      )
        throw new Error("Malformed input to Word");
    }

    rows = discardUnnecessaryForms(rows);
    this.rows = rows;
    if (original instanceof Word) {
      this.original = original.original;
    } else if (original) {
      // console.log(original)
      throw new Error("Expected original to be a Word");
    } else {
      this.original = this;
    }

    if (rows && !original) {
      if (this.rows.length === 0) {
        if (process.env.NODE_ENV === "development") {
          throw new Error("Word created with empty rows");
        }
      }
      this.setup();
    }
  }

  // /* temp */
  // highlight(input_string) {
  //   if (!input_string) return this;
  // }

  setup() {
    this.findIrregularities();
  }

  getId() {
    return this.original.rows[0]?.BIN_id;
  }

  getURL() {
    return `https://inflections.ylhyra.is/${encodeURIComponent(
      this.getBaseWord()
    )}/${this.getId()}`;
  }

  getBaseWord() {
    return (
      (this.original.rows.length > 0 && this.original.rows[0].base_word) || ""
    );
  }

  renderBaseWord(): Html {
    return `<h4 class="base_word">
      ${this.is("verb") ? `<span class=gray>að</span>` : ""}
      ${this.getBaseWord()}
    </h4>`;
  }

  getIsWordIrregular() {
    return this.original.wordIsIrregular;
  }

  getWordHasUmlaut() {
    return this.original.wordHasUmlaut;
  }

  is(
    ...args: (GrammaticalTagOrVariantNumber | InflectionalCategoryList)[]
  ): Boolean {
    const values = flatten(args) as InflectionalCategoryList;
    return values.every((value) => {
      /* Test word_categories */
      if (
        this.getWordCategories().includes(getCanonicalGrammaticalTag(value))
      ) {
        return true;
      }
      /* Test inflectional_form_categories */
      return (
        this.rows.length > 0 &&
        this.rows.every((row) =>
          row.inflectional_form_categories.includes(
            getCanonicalGrammaticalTag(value)
          )
        )
      );
    });
  }

  isAny(...args: InflectionalCategoryList | InflectionalCategoryList[]) {
    if (!args) return this;
    const values = flatten(args) as InflectionalCategoryList;
    return values.some((value) => {
      /* Test word_categories */
      if (
        this.getWordCategories().includes(getCanonicalGrammaticalTag(value))
      ) {
        return true;
      }
      /* Test inflectional_form_categories */
      return (
        this.rows.length > 0 &&
        this.rows.every((row) =>
          row.inflectional_form_categories.includes(
            getCanonicalGrammaticalTag(value)
          )
        )
      );
    });
  }

  get(
    ...args: (
      | InflectionalCategoryList
      | InflectionalCategoryList[number]
      | null
    )[]
  ): Word {
    if (!args) return this;
    const values = flatten(args) as InflectionalCategoryList;
    return new Word(
      this.rows.filter((row) =>
        values.filter(Boolean).every(
          (value) =>
            row.inflectional_form_categories.includes(
              getCanonicalGrammaticalTag(value)
            )
          // || row.word_categories.includes(value) // Should not be needed
        )
      ),
      this
    );
  }

  /**
   * Used in string table generation
   */
  getMostRelevantSibling(
    ...args: InflectionalCategoryList | InflectionalCategoryList[]
  ): Word {
    if (!args) return this;
    const values = flatten(args) as InflectionalCategoryList;
    let valuesCategories = values.map(
      (v) => getDescriptionFromGrammaticalTag(v)?.category
    );
    let tryToMatchAsManyAsPossible: InflectionalCategoryList = [];
    this.getClassificationOfFirstRow().forEach((c) => {
      let relevant_type_index = valuesCategories.findIndex(
        (v) => v === getDescriptionFromGrammaticalTag(c).category
      );
      if (relevant_type_index >= 0) {
        tryToMatchAsManyAsPossible.push(values[relevant_type_index]);
      } else {
        tryToMatchAsManyAsPossible.push(c);
      }
    });

    let possibleRows: {
      inflectional_form_categories: InflectionalCategoryList;
      match_score: number;
    }[] = this.getOriginal()
      .rows.map((row) => {
        if (
          !values.every((j) => row.inflectional_form_categories.includes(j))
        ) {
          // console.log({values,in:row.inflectional_form_categories})
          return null;
        }

        let match_score = 0;
        row.inflectional_form_categories.forEach((cat) => {
          if (tryToMatchAsManyAsPossible.includes(cat)) {
            match_score++;
          }
        });
        return {
          inflectional_form_categories: row.inflectional_form_categories,
          match_score,
        };
      })
      .filter(filterEmpty);

    if (possibleRows.length > 0) {
      let bestMatch = possibleRows
        .sort((a, b) => b.match_score - a.match_score)[0]
        .inflectional_form_categories.filter((i) => !isNumber(i));
      return this.getOriginal().get(bestMatch);
    } else {
      return this.returnEmptyWord();
    }
  }

  returnEmptyWord() {
    return new Word([], this);
  }

  /**
   * Returns all that meet *any* of the input values
   */
  getMeetingAny(
    ...args: InflectionalCategoryList | InflectionalCategoryList[]
  ) {
    if (!args) return this;
    const values = flatten(args) as InflectionalCategoryList;
    if (values.filter(Boolean).length === 0) return this;
    return new Word(
      this.rows.filter((row) =>
        values
          .filter(Boolean)
          .some((value) =>
            row.inflectional_form_categories.includes(
              getCanonicalGrammaticalTag(value)
            )
          )
      ),
      this
    );
  }

  getOriginal(): Word {
    if (this.original.rows.length === 0) throw new Error("Empty original");
    return this.original;
  }

  getFirst(): Word {
    return new Word(this.rows.slice(0, 1), this);
  }

  getFirstAndItsVariants(): Word {
    /* We make sure the categories are completely equal to prevent
     * verbs (which come in various deep nestings) from matching */
    let match = this.getClassificationOfFirstRow();
    return new Word(
      this.rows.filter(
        (row) =>
          match.length === row.inflectional_form_categories.length - 1 && // -1 to remove number
          match.every(
            (value, index) => value === row.inflectional_form_categories[index]
          )
      ),
      this
    );
  }

  getFirstValue(): string | undefined {
    return (
      (this.rows.length > 0 && this.rows[0].inflectional_form) || undefined
    );
  }

  getFirstValueRendered(): Html | undefined {
    return (this.rows.length > 0 && this.rows[0].formattedOutput) || undefined;
  }

  getForms(): string[] {
    return this.rows.map((row) => row.inflectional_form);
  }

  getForms_describe_as_string__temp() {
    return this.rows
      .map(
        (row) =>
          `${row.inflectional_form} ${row.inflectional_form_categories.join(
            ","
          )}`
      )
      .join("\n");
  }

  getWordCategories(): GrammaticalTagOrVariantNumber[] {
    return this.original.rows[0]?.word_categories || [];
  }

  getClassificationOfFirstRow(): GrammaticalTag[] {
    return ((this.rows.length > 0 &&
      this.rows[0].inflectional_form_categories.filter((i) => !isNumber(i))) ||
      []) as GrammaticalTag[];
  }

  without(...args: InflectionalCategoryList | InflectionalCategoryList[]) {
    if (!args) return this;
    const values = flatten(args) as InflectionalCategoryList;
    return new Word(
      this.rows.filter((row) =>
        values
          .filter(Boolean)
          .every(
            (value) =>
              !row.inflectional_form_categories.includes(
                getCanonicalGrammaticalTag(value)
              )
          )
      ),
      this
    );
  }

  /**
   * Used to ask "which case does this word have?"
   * E.g. getType('case') returns 'nominative'
   */
  getType(grammaticalCategory: GrammaticalCategory): GrammaticalTag {
    const classification = [
      ...this.getWordCategories(),
      // TODO: Should we get first class or that which applies to all?
      ...this.getClassificationOfFirstRow(),
    ];
    let relevantTypes = grammaticalCategories[grammaticalCategory];
    if (!relevantTypes) {
      throw new Error(`No grammatical category named ${grammaticalCategory}`);
    }
    return classification.find((i) =>
      relevantTypes!.includes(i as GrammaticalTag)
    ) as GrammaticalTag;
  }

  getDomain() {
    return (
      this.rows.length > 0 && relevant_BIN_domains[this.rows[0].BIN_domain]
    );
    // console.log(this.getFirst())
  }

  /**
   * Three values are inputted, a value is returned
   * based on the gender of the word.
   * Used when generating helper words
   */
  dependingOnGender(...values: any[]) {
    return values[
      ["masculine", "feminine", "neuter"].indexOf(
        this.getType("gender") as string
      )
    ];
  }

  /**
   * Five values are inputted, a value is returned
   * based on the subject type of the verb
   * Used when generating helper words
   */
  dependingOnSubject(...values: any[]) {
    if (this.is("impersonal with accusative subject")) {
      return values[1];
    } else if (this.is("impersonal with dative subject")) {
      return values[2];
    } else if (this.is("impersonal with genitive subject")) {
      return values[3];
    } else if (this.is("impersonal with dummy subject")) {
      return values[4];
    } else {
      return values[0];
    }
  }

  getTree() {
    return tree(this.rows);
  }

  /**
   * Used to render the word to a string outside of a table.
   * If in a table, the function renderCell() is used.
   */
  renderWithHelperWords(): Html {
    let output =
      this.getHelperWordsBefore() +
      " " +
      this.renderWithoutHelperWords()
        .map((i) => `<b>${i}</b>`)
        .join(" / ") +
      this.getHelperWordsAfter();
    output = output.trim();

    return output;
  }

  renderWithoutHelperWords(): Html[] {
    return this.rows.map((row) => {
      /* formattedOutput contains umlaut highlights */
      let out = row.formattedOutput || row.inflectional_form;
      if (row.matched_term === row.inflectional_form) {
        out = `<span class="highlight">${out}</span>`;
      }
      return out;
    });
  }

  debug() {
    console.log(this.rows.map((row) => row.inflectional_form));
  }
}

export default Word;
