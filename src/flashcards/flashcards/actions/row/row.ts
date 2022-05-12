import { Card } from "flashcards/flashcards/actions/card/card";
import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { deckSettingsFields } from "flashcards/flashcards/actions/deck/deckSettings.fields";
import { DeckSettings } from "flashcards/flashcards/actions/deck/deckSettings.types";
import { createCardId } from "flashcards/flashcards/actions/row/ids";
import { rowFields } from "flashcards/flashcards/actions/row/rowData.fields";
import {
  RowData,
  RowIds,
} from "flashcards/flashcards/actions/row/rowData.types";
import {
  CardIds,
  DependenciesForOneRowAsDependencyToDepth,
  Direction,
} from "flashcards/flashcards/types";
import { removeExtraWhitespaceFromObjectValuesAndDropUndefinedValues } from "modules/removeExtraWhitespace";
import { keys } from "modules/typescript/objectEntries";
import { warnIfFunctionIsSlow } from "modules/warnIfFunctionIsSlow";

//   interface Row2_d {
//     deck: Deck;
//     data: RowData;
//     cardIds(): CardIds | [];
//   }
//
// /**
//  * We have to use a prototype instead of a class
//  * due to performance issues with very large
//  * datasets.
//  * (Initializing prototypes is up to 30 times faster
//  * than initializing classes.)
//  */
// function Row2(this: Row2_d,deck: Deck, data: RowData) {
//   this.deck = deck;
//   this.data = data;
// }
//
// Row2.prototype.rowId = function () {
//   return this.data.rowId;
// };
//
// Row2.prototype.shouldCreateCards = function () {
//   return this.data.front && this.data.back;
// };
//
// Row2.prototype.cardIds = function () {
//   if (!this.shouldCreateCards) return [];
//   let cardIds: CardIds = [];
//   const directionSetting = this.getSetting("direction");
//   if (
//     directionSetting === "BOTH" ||
//     directionSetting === "ONLY_FRONT_TO_BACK"
//   ) {
//     cardIds.push(
//       createCardId(this.deck.deckId, this.data.rowId, Direction.FRONT_TO_BACK)
//     );
//   }
//   if (
//     directionSetting === "BOTH" ||
//     directionSetting === "ONLY_BACK_TO_FRONT"
//   ) {
//     cardIds.push(
//       createCardId(this.deck.deckId, this.data.rowId, Direction.BACK_TO_FRONT)
//     );
//   }
//   return cardIds;
// };
//
// Row2.prototype.cards = function (): Card[] {
//   const row = this;
//   return this.cardIds().map((cardId) => new Card(row, cardId));
// };
//
// Row2.prototype.dependsOn = function () {
//   throw new Error("Not implemented");
// };
//
// Row2.prototype.dependencies =
//   function (): DependenciesForOneRowAsDependencyToDepth {
//     return this.deck.dependencyGraph[this.rowId];
//   };
//
// Row2.prototype.getDependenciesAsArrayOfRowIds = function (): RowIds {
//   return keys(this.deck.dependencyGraph[this.rowId]);
// };
//
// Row2.prototype.alternativeIds = function () {
//   throw new Error("Not implemented");
// };
//
// /**
//  * Gets the row setting, falling back to the deck setting, falling back to defaults.
//  */
// Row2.prototype.getSetting = function <
//   T extends keyof DeckSettings & keyof RowData
// >(key: T): (DeckSettings & RowData)[T] {
//   return warnIfFunctionIsSlow.wrap(() => {
//     /* "!= null" tests for null and undefined */
//     if (this.data[key] != null) {
//       return this.data[key];
//     }
//     if (this.deck.settings[key] != null) {
//       return this.deck.settings[key];
//     }
//     return (
//       rowFields.find((field) => field.name === key)?.defaultValue ??
//       deckSettingsFields.find((field) => field.name === key)?.defaultValue
//     );
//   }) as (DeckSettings & RowData)[T];
// };
//
// Row2.prototype.toJSON = function () {
//   return removeExtraWhitespaceFromObjectValuesAndDropUndefinedValues(this.data);
// };

export class Row {
  deck: Deck;
  data: RowData;

  constructor(deck: Deck, data: RowData) {
    this.deck = deck;
    this.data = data;
    console.warn("hehe");
    // makeObservable(this, {
    //   data: observable,
    //   shouldCreateCards: computed({ keepAlive: true }),
    //   cardIds: computed({ keepAlive: true }),
    //   cards: computed({ keepAlive: true }),
    //   dependsOn: computed({ keepAlive: true }),
    //   alternativeIds: computed({ keepAlive: true }),
    // });
  }

  get rowId() {
    return this.data.rowId;
  }

  get shouldCreateCards() {
    return this.data.front && this.data.back;
  }

  get cardIds(): CardIds | [] {
    if (!this.shouldCreateCards) return [];
    let cardIds: CardIds = [];
    const directionSetting = this.getSetting("direction");
    if (
      directionSetting === "BOTH" ||
      directionSetting === "ONLY_FRONT_TO_BACK"
    ) {
      cardIds.push(
        createCardId(this.deck.deckId, this.data.rowId, Direction.FRONT_TO_BACK)
      );
    }
    if (
      directionSetting === "BOTH" ||
      directionSetting === "ONLY_BACK_TO_FRONT"
    ) {
      cardIds.push(
        createCardId(this.deck.deckId, this.data.rowId, Direction.BACK_TO_FRONT)
      );
    }
    return cardIds;
  }

  get cards(): Card[] {
    const row = this;
    return this.cardIds.map((cardId) => new Card(row, cardId));
  }

  get dependsOn() {
    throw new Error("Not implemented");
  }

  get dependencies(): DependenciesForOneRowAsDependencyToDepth {
    return this.deck.dependencyGraph[this.rowId];
  }

  getDependenciesAsArrayOfRowIds(): RowIds {
    return keys(this.deck.dependencyGraph[this.rowId]);
  }

  get alternativeIds() {
    throw new Error("Not implemented");
  }

  /**
   * Gets the row setting, falling back to the deck setting, falling back to defaults.
   */
  getSetting<T extends keyof DeckSettings & keyof RowData>(
    key: T
  ): (DeckSettings & RowData)[T] {
    return warnIfFunctionIsSlow.wrap(() => {
      /* "!= null" tests for null and undefined */
      if (this.data[key] != null) {
        return this.data[key];
      }
      if (this.deck.settings[key] != null) {
        return this.deck.settings[key];
      }
      return (
        rowFields.find((field) => field.name === key)?.defaultValue ??
        deckSettingsFields.find((field) => field.name === key)?.defaultValue
      );
    }) as (DeckSettings & RowData)[T];
  }

  toJSON() {
    return removeExtraWhitespaceFromObjectValuesAndDropUndefinedValues(
      this.data
    );
  }
}
