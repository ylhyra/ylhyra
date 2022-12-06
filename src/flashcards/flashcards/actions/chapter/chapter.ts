import { Deck } from "flashcards/flashcards/actions/deck/deck";
import { makeObservable, observable, action } from "mobx";
import { ChapterData } from "flashcards/flashcards/actions/chapter/chapterData";

export class Chapter {
  constructor(public deck: Deck, public data?: ChapterData) {
    // deck.rows.set(this.rowId, this);
    makeObservable(this, {
      data: observable,
    });
  }
}

export const newChapter = action((deck: Deck) => {
  deck.chapters.push(new Chapter(deck));
});
