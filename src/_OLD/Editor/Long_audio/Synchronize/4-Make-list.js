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

const MakeList = (input) => {

  /*
    Collect start and stop times
  */
  let events = []
  input.forEach(i => {
    events.push({
      time: (i.begin),
      type: 'begin',
      element: i.id
    })
    events.push({
      time: (i.end),
      type: 'end',
      element: i.id
    })
  })
  events = events.sort((a, b) => {
    return a.time - b.time
  })

  /*
   Join events
  */
  let list = []
  let last_time
  let elements = []
  events.forEach(({ time, type, element }) => {
    // Add
    if (type === 'begin') {
      elements.push(element)
    }
    // Remove
    else if (type === 'end') {
      if (elements.indexOf(element) > -1) {
        elements.splice(elements.indexOf(element), 1)
      }
    }

    // Add to list
    if (time !== last_time) {
      list.push({
        begin: time,
        elements: JSON.parse(JSON.stringify(elements)), // For some reason, the object isn't cloned. (?)
      })
    }
    // Update last element in list
    else {
      list[list.length - 1] = {
        begin: time,
        elements: JSON.parse(JSON.stringify(elements)), // For some reason, the object isn't cloned. (?)
      }
    }

    last_time = time
  })

  /*
    Add "time until next"
  */
  list = list.map((current, index) => {
    const next = list[index + 1]
    return {
      ...current,
      end: next ? next.begin : null,
    }
  })

  return list
}

export default MakeList
