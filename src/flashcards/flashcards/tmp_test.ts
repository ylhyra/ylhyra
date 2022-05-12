/*
   ts-node src/flashcards/flashcards/tmp_test.ts
 */

/**
 * Tilraun: Eru prototypur betri en classar?
 */
class row2 {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

const start = performance.now();

for (let i = 0; i < 100000; i++) {
  new row2("test" + i);
}

const time = performance.now() - start;
console.log(`Took ${Math.round(time)} milliseconds`);
