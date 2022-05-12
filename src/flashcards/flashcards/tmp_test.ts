// @ts-nocheck

/*
   ts-node src/flashcards/flashcards/tmp_test.ts
 */

import { makeAutoObservable } from "mobx";

/**
 * Tilraun: Eru prototypur betri en classar?
 */
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
    X.setName("Hello");
    deck.push(X);
  }
  const time = performance.now() - start;
  console.log(`Class took ${Math.round(time)} milliseconds`);
})();

(() => {
  let deck = [];
  const newRow = () => {
    return {
      name: "",
      setName: (name: string) => {
        this.name = name;
      },
    };
  };
  const start = performance.now();
  for (let i = 0; i < 100000; i++) {
    const X = newRow();
    X.setName("Hello");
    deck.push(X);
  }
  const time = performance.now() - start;
  console.log(`Static object took ${Math.round(time)} milliseconds`);
})();
