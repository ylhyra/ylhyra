/*
  Tracks time spent on page
*/
import axios from "app/App/axios";

// window.onbeforeunload = function(event) {
//   send()
// };

let referrer = document.referrer;

const send = () => {
  axios.post(`/api/a`, {
    // pageName: mw.config.get("wgPageName"),
  });
};

setTimeout(() => {
  send();
}, 5000);

window.addEventListener("blur", function () {
  // TextAnalytics.close();
});
// window.addEventListener('focus', function() {
// });
