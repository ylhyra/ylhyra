/*

  Opens up a WebSocket connection to the server.

  Some tasks (tokenization & translation) can take a long time,
  so it is easier to have an open connection to transmit data.

*/

import { receiveSuggestions } from 'Editor/Translator/Suggestions'
import error from 'App/Error'
const protocol = process.env.NODE_ENV === 'production' ? 'wss' : 'ws'
const host = process.env.NODE_ENV === 'production' ? location.host : 'localhost:9090'
let socket
let queued = []


const open = () => {
  console.log('%c [Opening WebSocket...]', 'color: MediumAquamarine')
  socket = new WebSocket(`${protocol}://${host}/api/`)
  socket.onopen = () => {
    console.log('%c [WebSocket opened]', 'color: MediumAquamarine')
    queued.forEach(message => socket.send(message))
    queued = []
  }
  socket.onmessage = ({ data }) => {
    console.log(`%c [WebSocket message received: ${JSON.parse(data).type}]`, 'color: MediumAquamarine')
    handle(JSON.parse(data))
  }
  socket.onerror = (e) => {
    console.error(e)
  }
  socket.onclose = () => {
    console.log('%c [WebSocket closed]', 'color: MediumAquamarine')
  }
}

const close = (message) => {
  socket && socket.close()
}

export const send = (message) => {
  message = JSON.stringify(message)
  if (!socket || status('CLOSED') || status('CLOSING')) {
    queued.push(message)
    open()
  } else if (status('CONNECTING')) {
    queued.push(message)
  } else if (status('OPEN')) {
    socket.send(message)
  }
}

const status = (name) => {
  return socket.readyState === socket[name]
}

const handle = (action) => {
  // if (action.type === 'TOKENIZED') {
  //   // handleTokenized(action)
  // } else
  if (action.type === 'REQUEST_SUGGESTIONS') {
    receiveSuggestions(action)
  } else {
    console.warn(`Unknown message from WebSocket: "${action.type}"`)
  }
}


/*
  TODO:
  We must switch over to this code,
  which attempts several times to connect.
*/
// initWebsocket(`${protocol}://${host}/api/`, null, 5000, 10).then((socket) => {
//   console.log('socket initialized!')
//   //do something with socket...
//
//   //if you want to use the socket later again and assure that it is still open:
//   initWebsocket('ws:\\localhost:8090', socket, 5000, 10).then(function(socket) {
//     //if socket is still open, you are using the same "socket" object here
//     //if socket was closed, you are using a new opened "socket" object
//   })
// }, () => {
//   console.log('init of socket failed!')
// })
// /**
//  * inits a websocket by a given url, returned promise resolves with initialized websocket, rejects after failure/timeout.
//  *
//  * @param url the websocket url to init
//  * @param existingWebsocket if passed and this passed websocket is already open, this existingWebsocket is resolved, no additional websocket is opened
//  * @param timeoutMs the timeout in milliseconds for opening the websocket
//  * @param numberOfRetries the number of times initializing the socket should be retried, if not specified or 0, no retries are made
//  *        and a failure/timeout causes rejection of the returned promise
//  * @return {Promise}
//  */
// function initWebsocket(url, existingWebsocket, timeoutMs, numberOfRetries) {
//   timeoutMs = timeoutMs ? timeoutMs : 1500;
//   numberOfRetries = numberOfRetries ? numberOfRetries : 0;
//   var hasReturned = false;
//   var promise = new Promise((resolve, reject) => {
//     setTimeout(function() {
//       if (!hasReturned) {
//         console.info('opening websocket timed out: ' + url);
//         rejectInternal();
//       }
//     }, timeoutMs);
//     if (!existingWebsocket || existingWebsocket.readyState != existingWebsocket.OPEN) {
//       if (existingWebsocket) {
//         existingWebsocket.close();
//       }
//       var websocket = new WebSocket(url);
//       websocket.onopen = function() {
//         if (hasReturned) {
//           websocket.close();
//         } else {
//           console.info('websocket to opened! url: ' + url);
//           resolve(websocket);
//         }
//       };
//       websocket.onclose = function() {
//         console.info('websocket closed! url: ' + url);
//         rejectInternal();
//       };
//       websocket.onerror = function() {
//         console.info('websocket error! url: ' + url);
//         rejectInternal();
//       };
//     } else {
//       resolve(existingWebsocket);
//     }
//
//     function rejectInternal() {
//       if (numberOfRetries <= 0) {
//         reject();
//       } else if (!hasReturned) {
//         hasReturned = true;
//         console.info('retrying connection to websocket! url: ' + url + ', remaining retries: ' + (numberOfRetries - 1));
//         initWebsocket(url, null, timeoutMs, numberOfRetries - 1).then(resolve, reject);
//       }
//     }
//   });
//   promise.then(function() { hasReturned = true; }, function() { hasReturned = true; });
//   return promise;
// }
