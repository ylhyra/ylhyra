/*
  Tracks time spent on page
*/
import axios from "app/App/axios";
import {
  saveInLocalStorage,
  getFromLocalStorage,
  ANALYTICS_LOCALSTORAGE_LABEL,
} from "app/App/functions/localStorage";
const ignoredUrls = ["/", "/frontpage"];

let likelyNotABot = null;

class Analytics {
  timer = null;
  startTime = null;
  currentPage = null;
  referrer = document.referrer;
  queue = getFromLocalStorage(ANALYTICS_LOCALSTORAGE_LABEL) || [];
  startReadingPage = (url) => {
    if (url === this.currentPage) return;
    this.currentPage = url;
    this.stopReadingPage();
    this.startTime = new Date().getTime();
  };
  stopReadingPage = () => {
    if (!likelyNotABot) return;
    if (!this.currentPage) return;
    const timeDiff = new Date().getTime() - this.startTime;
    // Discard if page was only seen for <10 seconds
    if (timeDiff < 10 * 1000) return;
    this.queue.push({
      url: this.currentPage,
      seconds: Math.max(4 * 60, Math.round(timeDiff / 1000)),
      interaction_type: "page_view",
      referrer: this.referrer,
    });
    this.referrer = null;
    this.currentPage = null;
    this.save();
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(this.sync, 5 * 1000);
  };
  save = () => {
    saveInLocalStorage(ANALYTICS_LOCALSTORAGE_LABEL, this.queue);
  };
  sync = () => {
    if (!likelyNotABot) return;
    axios.post(`/api/a`, {
      queue: this.queue,
    });
    this.queue = [];
    this.save();
  };
}
export default Analytics;

window.addEventListener("blur", function () {
  // TextAnalytics.close();
});
// window.addEventListener('focus', function() {
// });
window.onbeforeunload = function (event) {
  Analytics.stopReadingPage();
};

/* Prevent crawlers from being logged */
const eventListeners = ["mousemove", "touchstart", "scroll"];
const setLikelyNotABot = () => {
  likelyNotABot = true;
  eventListeners.forEach((eventListener) => {
    document.body.removeEventListener(eventListener, setLikelyNotABot);
  });
};
eventListeners.forEach((eventListener) => {
  document.body.addEventListener(eventListener, setLikelyNotABot);
});
