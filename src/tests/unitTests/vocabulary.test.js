import Deck from "app/vocabulary/actions/deck";
import { getCardByText } from "app/vocabulary/actions/card/functions";
import { getHash } from "maker/vocabulary_maker/compile/functions";

// const console = require("console");

const cardPair = ({ icelandic, english, term, dependencies = {} }) => {
  const hash = getHash(icelandic);
  return {
    cards: {
      [`${hash}_is`]: {
        id: `${hash}_is`,
        is_formatted: icelandic,
        en_formatted: english,
        from: "is",
        terms: [term],
        sortKey: 1,
      },
      [`${hash}_en`]: {
        id: `${hash}_en`,
        is_formatted: icelandic,
        en_formatted: english,
        from: "en",
        terms: [term],
        sortKey: 2,
      },
    },
    term: {
      [term]: {
        cards: [`${hash}_is`, `${hash}_en`],
        dependencies,
      },
    },
  };
};

beforeAll(() => {
  const fixtures = [
    cardPair({ icelandic: "ég er", english: "I am", term: "to-be" }),
    cardPair({
      icelandic: "Gaman að sjá þig.",
      english: "Nice to see you.",
      term: "greeting",
    }),
    cardPair({
      icelandic: "Það er gott að búa á Íslandi.",
      english: "Living in Iceland is nice.",
      term: "living-in-iceland",
      dependencies: { "shared-good": 1 },
    }),
    cardPair({
      icelandic: "Er vikan þín búin að vera góð?",
      english: "Has your week been good?",
      term: "good-week",
      dependencies: { "shared-good": 1 },
    }),
  ];
  const database = fixtures.reduce(
    (all, fixture) => ({
      cards: { ...all.cards, ...fixture.cards },
      terms: { ...all.terms, ...fixture.term },
    }),
    { cards: {}, terms: {} }
  );
  const dependency = cardPair({
    icelandic: "góður",
    english: "good",
    term: "shared-good",
  });
  Object.assign(database.cards, dependency.cards);
  Object.assign(database.terms, dependency.term);

  new Deck({ database, schedule: {}, user_data: {} });
});

test("siblings", () => {
  const card1 = getCardByText("ég er");
  expect(card1.getSiblingCards().length).toBe(1);
  expect(card1.getSiblingCards()[0].printWord()).toBe("I am");
});

test("isTextSimilarTo", () => {
  const card1 = getCardByText("Gaman að sjá þig."); // Nice to see you.
  expect(card1.phoneticHashArray).not.toBeFalsy();
  const card2 = getCardByText("Það er gott að búa á Íslandi."); // It is nice ...
  expect(card1.isTextSimilarTo(card2)).toBe(true);
});

test("hasDependenciesInCommonWith", () => {
  expect(
    getCardByText("Er vikan þín búin að vera góð?").hasDependenciesInCommonWith(
      getCardByText("Það er gott að búa á Íslandi.")
    )
  ).toBe(true);
});
