// @ts-nocheck
import { makeObservable, observable } from "mobx";

class Example {
  observableObject = {};
  nonObservableObject = {};
  constructor() {
    makeObservable(this, {
      observableObject: observable,
    });
  }
}
const example = new Example();

let items = {};
for (let i = 0; i < 50000; i++) {
  items[i] = i;
}
const start = performance.now();
example.nonObservableObject = { ...example.nonObservableObject, ...items };
console.log(`Test took ${Math.round(performance.now() - start)} milliseconds`);
