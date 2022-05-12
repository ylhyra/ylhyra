// @ts-nocheck

/*
   Tilraun: Eru prototypur betri en classar?
   ts-node src/flashcards/flashcards/tmp_test.ts
   Svar: já, 30x hraðari.
 */
import { makeAutoObservable, observable } from "mobx";

(() => {
  let deck = [];
  class row2 {
    name: string;
    constructor() {
      makeAutoObservable(this);
    }
    setName(name: string) {
      this.name = name;
    }
  }

  const start = performance.now();
  for (let i = 0; i < 100000; i++) {
    const X = new row2();
    X.setName("Hello" + i);
    deck.push(X);
  }
  const time = performance.now() - start;
  console.log(`Class took ${Math.round(time)} milliseconds`);
})();

(() => {
  let deck = [];

  // function newRow() {
  function F() {}
  F.prototype.name = observable.box("");
  F.prototype.setName = function (name: string) {
    this.name = name;
  };
  //   return new F();
  // }

  const start = performance.now();
  for (let i = 0; i < 100000; i++) {
    const X = new F();
    X.setName("Hello" + i);
    deck.push(X);
  }
  const time = performance.now() - start;
  console.log(`Prototype took ${Math.round(time)} milliseconds`);
})();
