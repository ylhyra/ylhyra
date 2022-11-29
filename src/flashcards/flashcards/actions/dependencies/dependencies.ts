import { computed, makeObservable } from "mobx";
import { Row } from "flashcards/flashcards/actions/row/row";

export class Dependencies {
  constructor(public row: Row) {
    makeObservable(this);
  }

  @computed({ keepAlive: true })
  get directDependencies(): Set<Row> {
    const dependsOnStrings = [this.row.dependsOn].filter(Boolean) as string[];
    let rows = new Set<Row>();
    for (const string of dependsOnStrings) {
      if (string in this.row.deck.redirectsToRow) {
        rows.add(this.row.deck.redirectsToRow[string]);
      }
    }
    return rows;
  }

  @computed({ keepAlive: true })
  get dependenciesWithDepth(): Map<Row, number> {
    const output = new Map<Row, number>([[this.row, 0]]);

    function addDependencies(
      row: Row,
      depth: number = 0,
      alreadySeenDirectParents: Row[] = [],
    ) {
      /* Deep copy in order to only watch direct parents */
      alreadySeenDirectParents = [...alreadySeenDirectParents, row];
      for (const dependency of row.dependencies.directDependencies) {
        if (alreadySeenDirectParents.includes(dependency)) continue;
        if (!output.has(dependency) || output.get(dependency)! < depth) {
          output.set(dependency, depth + 1);
          addDependencies(dependency, depth + 1, alreadySeenDirectParents);
        }
      }
    }
    addDependencies(this.row);

    return output;
  }
}
