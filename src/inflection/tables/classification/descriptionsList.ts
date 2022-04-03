import { GrammaticalCategory, GrammaticalTag } from "inflection/tables/types";

export type Description = {
  title: GrammaticalTag;
  icelandic_title: string;
  /** Must begin with the classification shortcut used in BÍN */
  category: GrammaticalCategory;
  shortcuts: GrammaticalTag[];
  has_article_on_ylhyra: Boolean;
};

/**
 * Descriptions derived from:
 *  - https://bin.arnastofnun.is/gogn/k-snid and
 *  - https://bin.arnastofnun.is/gogn/greiningarstrengir/
 * By Árni Magnússon Institute for Icelandic Studies
 * Note: Must be correctly sorted.
 */
export const descriptions: Description[] = [
  /* Person */
  {
    title: "1st person",
    icelandic_title: "1. persóna",
    category: "person",
    shortcuts: ["1p"],
    has_article_on_ylhyra: false,
  },
  {
    title: "2nd person",
    icelandic_title: "2. persóna",
    category: "person",
    shortcuts: ["2p"],
    has_article_on_ylhyra: false,
  },
  {
    title: "3rd person",
    icelandic_title: "3. persóna",
    category: "person",
    shortcuts: ["3p"],
    has_article_on_ylhyra: false,
  },

  /* Case */
  {
    title: "nominative",
    icelandic_title: "nefnifall",
    category: "case",
    shortcuts: ["nf", "nom"],
    has_article_on_ylhyra: true,
  },
  {
    title: "accusative",
    icelandic_title: "þolfall",
    category: "case",
    shortcuts: ["þf", "acc"],
    has_article_on_ylhyra: true,
  },
  {
    title: "dative",
    icelandic_title: "þágufall",
    category: "case",
    shortcuts: ["þgf", "dat"],
    has_article_on_ylhyra: true,
  },
  {
    title: "genitive",
    icelandic_title: "eignarfall",
    category: "case",
    shortcuts: ["ef", "gen"],
    has_article_on_ylhyra: true,
  },

  /* Plurality */
  {
    title: "singular",
    icelandic_title: "eintala",
    category: "plurality",
    shortcuts: ["et", "sing", "sg", "s"],
    has_article_on_ylhyra: false,
  },
  {
    title: "plural",
    icelandic_title: "fleirtala",
    category: "plurality",
    shortcuts: ["ft", "plur", "pl", "p"],
    has_article_on_ylhyra: false,
  },

  /* Gender */
  {
    title: "masculine",
    icelandic_title: "karlkyn",
    category: "gender",
    shortcuts: ["kk", "masc"],
    has_article_on_ylhyra: true,
  },
  {
    title: "feminine",
    icelandic_title: "kvenkyn",
    category: "gender",
    shortcuts: ["kvk", "fem"],
    has_article_on_ylhyra: true,
  },
  {
    title: "neuter",
    icelandic_title: "hvorugkyn",
    category: "gender",
    shortcuts: ["hk", "hvk", "neut"],
    has_article_on_ylhyra: true,
  },

  /* Article */
  {
    title: "without definite article",
    icelandic_title: "án greinis",
    category: "article",
    shortcuts: ["ángr", "no article"],
    has_article_on_ylhyra: true,
  },
  {
    title: "with definite article",
    icelandic_title: "með greini",
    category: "article",
    shortcuts: ["meðgr", "with article"],
    has_article_on_ylhyra: true,
  },

  /* Tense */
  {
    title: "present tense",
    icelandic_title: "nútíð",
    category: "tense",
    shortcuts: ["nt", "present", "pres", "prs"],
    has_article_on_ylhyra: false,
  },
  {
    title: "past tense",
    icelandic_title: "þátíð",
    category: "tense",
    shortcuts: ["þt", "past", "pst"],
    has_article_on_ylhyra: false,
  },

  /* Degree */
  {
    title: "positive degree",
    icelandic_title: "frumstig",
    category: "degree",
    shortcuts: ["fst", "positive"],
    has_article_on_ylhyra: false,
  },
  {
    title: "comparative degree",
    icelandic_title: "miðstig",
    category: "degree",
    shortcuts: ["mst", "comparative"],
    has_article_on_ylhyra: false,
  },
  {
    title: "superlative degree",
    icelandic_title: "efsta stig",
    category: "degree",
    shortcuts: ["est", "superlative"],
    has_article_on_ylhyra: false,
  },

  /* Strong or weak */
  {
    title: "strong declension",
    icelandic_title: "sterk beyging",
    category: "strong or weak",
    shortcuts: ["sb", "sterk", "strong"],
    has_article_on_ylhyra: false,
  },
  {
    title: "weak declension",
    icelandic_title: "veik beyging",
    category: "strong or weak",
    shortcuts: ["vb", "veik", "weak"],
    has_article_on_ylhyra: false,
  },

  {
    title: "infinitive",
    icelandic_title: "nafnháttur",
    category: "",
    shortcuts: ["nh", "inf"],
    has_article_on_ylhyra: true,
  },
  {
    title: "indicative",
    icelandic_title: "framsöguháttur",
    category: "",
    shortcuts: [
      "fh",
      "ind",
      "real",
      "realis",
      "realis mood",
      "indicative mood",
    ],
    has_article_on_ylhyra: true,
  },
  {
    title: "subjunctive",
    icelandic_title: "viðtengingarháttur",
    category: "",
    shortcuts: ["vh", "subj"],
    has_article_on_ylhyra: true,
  },

  {
    title: "active voice",
    icelandic_title: "germynd",
    category: "",
    shortcuts: ["gm", "active"],
    has_article_on_ylhyra: false,
  },
  {
    title: "middle voice",
    icelandic_title: "miðmynd",
    category: "",
    shortcuts: ["mm", "med", "mediopassive", "mid"],
    has_article_on_ylhyra: true,
  },
  {
    title: "imperative",
    icelandic_title: "boðháttur",
    category: "",
    shortcuts: ["bh", "imp"],
    has_article_on_ylhyra: true,
  },
  {
    title: "clipped imperative",
    icelandic_title: "stýfður boðháttur",
    category: "",
    shortcuts: ["stýfður", "styfdur", "clipped"],
    has_article_on_ylhyra: false,
  },

  {
    title: "present participle",
    icelandic_title: "lýsingarháttur nútíðar",
    category: "",
    shortcuts: ["lhnt"],
    has_article_on_ylhyra: false,
  },
  {
    title: "supine",
    icelandic_title: "sagnbót",
    category: "",
    shortcuts: ["sagnb", "sup"],
    has_article_on_ylhyra: false,
  },
  {
    title: "past participle",
    icelandic_title: "lýsingarháttur þátíðar",
    category: "",
    shortcuts: ["lhþt"],
    has_article_on_ylhyra: false,
  },
  {
    title: "question form",
    icelandic_title: "spurnarmynd",
    category: "",
    shortcuts: ["sp"],
    has_article_on_ylhyra: false,
  },

  {
    title: "optative",
    icelandic_title: "óskháttur",
    category: "",
    shortcuts: ["oskh"],
    has_article_on_ylhyra: false,
  },
  {
    title: "not used in a noun phrase",
    icelandic_title: "sérstætt",
    category: "",
    shortcuts: ["serst"],
    has_article_on_ylhyra: false,
  },
  {
    title: "personal",
    icelandic_title: "persónuleg beyging",
    category: "",
    shortcuts: ["persónuleg", "pers"],
    has_article_on_ylhyra: false,
  },
  {
    title: "impersonal",
    icelandic_title: "ópersónuleg beyging",
    category: "",
    shortcuts: ["op"],
    has_article_on_ylhyra: false,
  },
  {
    title: "impersonal with accusative subject",
    icelandic_title: "ópersónuleg beyging með frumlag í þolfalli",
    category: "",
    shortcuts: ["op-þf"],
    has_article_on_ylhyra: false,
  },
  {
    title: "impersonal with dative subject",
    icelandic_title: "ópersónuleg beyging með frumlag í þágufalli",
    category: "",
    shortcuts: ["op-þgf"],
    has_article_on_ylhyra: false,
  },
  {
    title: "impersonal with genitive subject",
    icelandic_title: "ópersónuleg beyging með frumlag í eignarfalli",
    category: "",
    shortcuts: ["op-ef"],
    has_article_on_ylhyra: false,
  },
  {
    title: "impersonal with dummy subject",
    icelandic_title: "ópersónuleg beyging með gervifrumlag",
    category: "",
    shortcuts: ["op-það"],
    has_article_on_ylhyra: false,
  },
  {
    title: "indeclinable",
    icelandic_title: "óbeygjanlegt",
    category: "",
    shortcuts: ["obeygjanlegt"],
    has_article_on_ylhyra: false,
  },

  /* Word classes */
  {
    title: "noun",
    icelandic_title: "nafnorð",
    category: "word_class",
    shortcuts: ["no", "n"],
    has_article_on_ylhyra: true,
  },
  {
    title: "preposition",
    icelandic_title: "forsetning",
    category: "word_class",
    shortcuts: ["fs", "pre", "prep"],
    has_article_on_ylhyra: false,
  },
  {
    title: "adverb",
    icelandic_title: "atviksorð",
    category: "word_class",
    shortcuts: ["ao", "adv"],
    has_article_on_ylhyra: false,
  },
  {
    title: "article",
    icelandic_title: "greinir",
    category: "word_class",
    shortcuts: ["gr"],
    has_article_on_ylhyra: false,
  },
  {
    title: "adjective",
    icelandic_title: "lýsingarorð",
    category: "word_class",
    shortcuts: ["lo", "adj", "a"],
    has_article_on_ylhyra: true,
  },
  {
    title: "infinitive particle",
    icelandic_title: "nafnháttarmerki",
    category: "word_class",
    shortcuts: ["nhm"],
    has_article_on_ylhyra: false,
  },
  {
    title: "verb",
    icelandic_title: "sagnorð",
    category: "word_class",
    shortcuts: ["so", "v"],
    has_article_on_ylhyra: true,
  },
  {
    title: "conjunction",
    icelandic_title: "samtenging",
    category: "word_class",
    shortcuts: ["st", "conj"],
    has_article_on_ylhyra: false,
  },
  {
    title: "interjection",
    icelandic_title: "upphrópun",
    category: "word_class",
    shortcuts: ["uh", "int"],
    has_article_on_ylhyra: false,
  },
  {
    title: "numeral",
    icelandic_title: "töluorð",
    category: "word_class",
    shortcuts: ["to"],
    has_article_on_ylhyra: false,
  },
  {
    title: "ordinal number",
    icelandic_title: "raðtala",
    category: "word_class",
    shortcuts: ["rt", "ordinal"],
    has_article_on_ylhyra: false,
  },
  {
    title: "pronoun",
    icelandic_title: "fornafn",
    category: "word_class",
    shortcuts: ["fn"],
    has_article_on_ylhyra: true,
  },
  {
    title: "reflexive pronoun",
    icelandic_title: "afturbeygt fornafn",
    category: "word_class",
    shortcuts: ["afn"],
    has_article_on_ylhyra: false,
  },
  {
    title: "personal pronoun",
    icelandic_title: "persónufornafn",
    category: "word_class",
    shortcuts: ["pfn"],
    has_article_on_ylhyra: false,
  },
];
