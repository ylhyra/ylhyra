"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRowName = exports.row_titles = exports.row_info = exports.row_info_array = void 0;
const ucfirst_1 = require("app/app/functions/ucfirst");
const constants_1 = require("app/vocabulary/constants");
exports.row_info_array = [
    { name: "icelandic", alwaysShow: true },
    { name: "english", alwaysShow: true },
    { name: "lemmas", alwaysShow: true },
    { name: "depends_on", alwaysShow: true },
    { name: "alternative_id" },
    { name: "this_is_a_minor_variation_of" },
    {
        name: "level",
        alwaysShow: true,
        isNumber: true,
        options: [
            { value: constants_1.A1, title: "A1" },
            { value: constants_1.A2, title: "A2" },
            { value: constants_1.B1, title: "B1" },
            { value: constants_1.B2, title: "B2" },
            { value: constants_1.C1, title: "C1" },
            { value: constants_1.C2, title: "C2" },
        ],
    },
    {
        name: "importance",
        alwaysShow: true,
        isNumber: true,
        options: [
            { value: constants_1.VERY_UNIMPORTANT, title: "Very unimportant" },
            { value: constants_1.UNIMPORTANT, title: "Unimportant" },
            { value: constants_1.NORMAL_IMPORTANCE, title: "Normal" },
            { value: constants_1.IMPORTANT, title: "Important" },
            { value: constants_1.VERY_IMPORTANT, title: "Very important" },
        ],
    },
    {
        name: "difficulty",
        alwaysShow: true,
        isNumber: true,
        options: [
            { value: constants_1.NOT_DIFFICULT, title: "Not difficult" },
            { value: constants_1.DIFFICULT_FOR_BEGINNERS, title: "Difficult for beginners" },
            {
                value: constants_1.DIFFICULT_FOR_INTERMEDIATE,
                title: "Difficult for intermediate",
            },
            { value: constants_1.DIFFICULT_FOR_ADVANCED, title: "Difficult for advanced" },
        ],
    },
    { name: "dont_confuse" },
    { name: "related_items" },
    { name: "direction" },
    { name: "note" },
    { name: "note_regarding_english" },
    { name: "literally" },
    { name: "synonyms" },
    { name: "pronunciation" },
    { name: "categories" },
    { name: "grammar_tags" },
    { name: "example_declension" },
    { name: "athugasemd_til_min" },
    { name: "fix" },
    { name: "eyða" },
];
exports.row_info = exports.row_info_array.reduce((prev, row) => {
    return Object.assign(Object.assign({}, prev), { [row.name]: row });
}, {});
exports.row_titles = Object.keys(exports.row_info);
const formatRowName = (i) => {
    if (!i)
        return "";
    return (0, ucfirst_1.ucfirst)(i).replaceAll("_", " ");
};
exports.formatRowName = formatRowName;
