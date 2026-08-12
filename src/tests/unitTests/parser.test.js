import { html2json, json2html } from "app/app/functions/html2json";
import ExtractText from "documents/parse/ExtractText/ExtractText";
import Tokenizer from "documents/parse/Tokenize";
import WrapInTags from "documents/parse/WrapInTags";
import { DiffAndPreserveIDs } from "documents/parse/Tokenize/IDs/PreserveIDs";

const sentence = (id, text) => ({
  id,
  text,
  words: text
    .replace(/[.?]$/, "")
    .split(" ")
    .map((word, index) => ({ id: `${id}_w${index}`, text: word })),
});

test("a br inside a heading remains part of one translated sentence", () => {
  const json = html2json(
    '<i data-document-start="title"></i>' +
      '<translate><h1>Vinkonur vors <br/>og blóma</h1></translate>' +
      '<i data-document-end="title"></i>'
  );

  const extracted = ExtractText(json);
  expect(extracted.title).toHaveLength(1);
  expect(extracted.title[0].text).toBe("Vinkonur vors og blóma");

  const tokenized = Tokenizer(extracted, {});
  expect(tokenized.title[0].sentences).toHaveLength(1);
  expect(tokenized.title[0].sentences[0].text).toBe(
    "Vinkonur vors og blóma"
  );

  const wrapped = json2html(WrapInTags({ json, tokenized }));
  expect(wrapped.match(/<sentence\b/g)).toHaveLength(1);
  expect(wrapped).toContain("</word> <br/><word");
  expect(wrapped).not.toMatch(/<word[^>]*><br\/>/);
  expect(wrapped).toMatch(/<br\/><word[^>]*>og<\/word>/);
});

test("adjacent spelling fixes preserve each sentence's own translation and audio ID", () => {
  const oldSentences = [
    sentence(
      "s_party",
      "Nokkrum árum síðar vorum við í partýi í sumarbústað hjá vini okkar."
    ),
    sentence("s_question_audio", "Ertu enn ástfanginn af honum?"),
  ];
  const newSentences = [
    sentence(
      "new_party",
      "Nokkrum árum síðar vorum við í partíi í sumarbústað hjá vini okkar."
    ),
    sentence("new_question", "Ertu enn ástfangin af honum?"),
  ];

  const preserved = DiffAndPreserveIDs(
    oldSentences.map(({ id, text }) => ({ id, text: text.toLowerCase() })),
    newSentences.map(({ id, text }) => ({ id, text: text.toLowerCase() }))
  );

  expect(preserved).toEqual({
    new_party: "s_party",
    new_question: "s_question_audio",
  });

  const translations = {
    s_party: { meaning: "A few years later ..." },
    s_question_audio: { meaning: "Are you still in love with him?" },
  };
  const forcedAlignment = [
    { begin: 68.48, end: 79.48, elements: ["s_party"] },
    { begin: 79.48, end: 82.48, elements: ["s_question_audio"] },
  ];

  expect(translations[preserved.new_question].meaning).toBe(
    "Are you still in love with him?"
  );
  expect(
    forcedAlignment.find(({ elements }) =>
      elements.includes(preserved.new_question)
    )
  ).toMatchObject({ begin: 79.48, end: 82.48 });
});
