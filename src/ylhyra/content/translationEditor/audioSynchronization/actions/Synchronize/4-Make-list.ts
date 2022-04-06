/*

   Merge overlapping time spans.

   Example input: [
     { begin: 0.000, end: 4.400, id: "s0",  },
     { begin: 0.000, end: 1.930, id: "w1",  },
     { begin: 1.930, end: 2.315, id: "w2",  },
   ]

   Example output: [
    { begin: 0.000, end: 1.930, elements: ["s0","w1"] },
    { begin: 1.930, end: 2.315, elements: ["s0","w2"] }
    { begin: 2.315, end: 4.400, elements: ["s0"] }
   ]

*/

import {
  LongAudioSyncData,
  LongAudioSyncDataIntermediateForm,
} from "ylhyra/content/translationEditor/audioSynchronization/types";

export default function MakeLongAudioSyncList(
  input: LongAudioSyncDataIntermediateForm[]
): LongAudioSyncData[] {
  /*
    Collect start and stop times
  */
  let events: {
    time: number;
    type: "begin" | "end";
    element: string;
  }[] = [];
  input.forEach((i) => {
    events.push({
      time: i.begin,
      type: "begin",
      element: i.id,
    });
    events.push({
      time: i.end,
      type: "end",
      element: i.id,
    });
  });
  events = events.sort((a, b) => {
    return a.time - b.time;
  });

  /*
   Join events
  */
  let beginTimes: { begin: number; elements: string[] }[] = [];
  let lastTime: number;
  let elements: string[] = [];
  events.forEach(({ time, type, element }) => {
    // Add
    if (type === "begin") {
      elements.push(element);
    }
    // Remove
    else if (type === "end") {
      if (elements.indexOf(element) > -1) {
        elements.splice(elements.indexOf(element), 1);
      }
    }

    // Add to list
    if (time !== lastTime) {
      beginTimes.push({
        begin: time,
        elements: elements.slice(),
      });
    }
    // Update last element in list
    else {
      beginTimes[beginTimes.length - 1] = {
        begin: time,
        elements: elements.slice(),
      };
    }

    lastTime = time;
  });

  /*
    Calculates the "time until next" (?)
  */
  const out: LongAudioSyncData[] = beginTimes.map((current, index) => {
    const next = beginTimes[index + 1];
    return {
      ...current,
      end: next ? next.begin : null,
    } as LongAudioSyncData;
  });

  return out;
}
