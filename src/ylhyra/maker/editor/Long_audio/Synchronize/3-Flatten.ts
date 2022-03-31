/*
  Gets "BEGIN" and "END" time markers from Aeneas output

  Example input from Aeneas:
    {
      fragments: [{
        id: "root",
        children: [{
            id: "s0",
            begin: "0.000",
            end: "4.400",
            children: [{
                id: "w1",
                begin: "0.000",
                end: "1.930",
              }, {
                id: "w2",
                begin: "1.930",
                end: "2.315",
              }
            ]
          }
        ]
      }]
    }

  Example output: [
    { begin: 0.000, end: 4.400, id: "s0",  },
    { begin: 0.000, end: 1.930, id: "w1",  },
    { begin: 1.930, end: 2.315, id: "w2",  },
  ]
*/
import {
  AeneasOutput,
  UnprocessedLongAudioSyncData,
} from "ylhyra/documents/parse/types";

export default function FlattenAeneasData(
  input: AeneasOutput["fragments"]
): UnprocessedLongAudioSyncData[] {
  let elements: UnprocessedLongAudioSyncData[] = [];
  const Flatten = (
    input:
      | AeneasOutput["fragments"]
      | AeneasOutput["fragments"][number]["children"]
      | AeneasOutput["fragments"][number]["children"][number]["children"]
  ) => {
    Array.isArray(input) &&
      input.forEach((i) => {
        if (i.id !== "root" && "begin" in i) {
          elements.push({
            begin: Math.max(0, parseFloat(i.begin)),
            end: Math.max(0, parseFloat(i.end)),
            id: i.id,
          });
        }
        if ("children" in i) {
          Flatten(i.children);
        }
      });
  };
  Flatten(input);
  return elements;
}
