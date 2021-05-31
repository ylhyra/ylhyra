import { hour, day } from 'project/frontend/App/functions/time.js'
import _ from 'underscore'

/**
 * @memberof Deck
 */
export const createCards = (options) => {
  const forbidden_ids = options && options.forbidden_ids || []
  const now = (new Date()).getTime()
  console.log(now - 12 * hour)
  /* Previously seen cards */
  let bad_cards_ids = []
  let good_overdue_ids = []
  let not_overdue_ids = []
  let scheduled = Object.keys(this.schedule)
    .filter(id => !forbidden_ids.includes(id))
    .map(id => ({ id, ...this.schedule[id] }))
    .sort((a, b) => a.due - b.due)
    .forEach(i => {
      // if (i.last_seen > now - 12 * hour) return;
      // if (i.score <= 1.01) {
      //   bad_cards_ids.push(i.id)
      // } else
      // console.log(`${prettyPrintTimestamp(i.due)}`)
      if (i.due < now) {
        good_overdue_ids.push(i.id)
      } else {
        // not_overdue_ids.push(i.id)
      }
    })
  console.log(`${good_overdue_ids.length} overdue`)
  let chosen_ids = _.shuffle([
    ..._.shuffle(bad_cards_ids).slice(0, 8),
    ...good_overdue_ids.slice(0, 20),
    // ...not_overdue_ids.slice(0, 14),
  ].slice(0, 30))

  /* New cards */
  let new_cards_to_add = 8 // chosen_ids.length > 10 ? 2 : 15
  let new_card_ids = [];
  for (let i = 0; i < this.cards_sorted.length; i++) {
    const id = this.cards_sorted[i].id
    if (forbidden_ids.includes(id)) {
      continue;
    }
    if (
      chosen_ids.length + new_card_ids.length < 15 &&
      new_card_ids.length < new_cards_to_add
    ) {
      if (!(id in this.schedule)) {
        new_card_ids.push(id)
      }
    } else {
      break;
    }
  }

  /* Interleave new cards with old cards */
  const ratio = chosen_ids.length / new_card_ids.length
  new_card_ids.forEach((id, index) => {
    /* Inserts item at correct ratio to spread new and old cards out. */
    chosen_ids.splice(
      Math.round(ratio * index) +
      index + /* To make up for the cards we've already added */
      1, /* Plus one to make old cards show up first */
      0, id
    )
  })
  // TEMP!! bara fyrir mig!
  new_card_ids.reverse()

  /* Related cards */
  // chosen


  /* Depends on cards */
  // TODO
  //
  let chosen = chosen_ids.map(id => ({ id, ...this.cards[id] }))
  // console.log(chosen_ids)
  return chosen
}


// 
// // https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
// function prettyPrintTimestamp(timestamp) {
//   var a = new Date(timestamp);
//   var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   var year = a.getFullYear();
//   var month = months[a.getMonth()];
//   var date = a.getDate();
//   var hour = a.getHours();
//   var min = a.getMinutes();
//   var sec = a.getSeconds();
//   var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
//   return time;
// }
