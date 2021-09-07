/*
  Tracks time spent on page
*/
import { now } from "app/app/functions/time";
import axios from "app/app/axios";
import {
  ANALYTICS_LOCALSTORAGE_LABEL,
  getFromLocalStorage,
  saveInLocalStorage,
} from "app/app/functions/localStorage";
import { isBrowser } from "app/app/functions/isBrowser";
import { isDev } from "app/app/functions/isDev";

const ignoredUrls = ["/", "/frontpage"];

let likelyNotABot = null;

class Analytics {
  timer = null;
  startTime = null;
  currentPage = null;
  referrer = isBrowser && document.referrer;
  queue = getFromLocalStorage(ANALYTICS_LOCALSTORAGE_LABEL) || [];
  startReadingPage = (url) => {
    if (url === this.currentPage) return;
    this.stopReadingPage();
    this.currentPage = url;
    this.startTime = now();
  };
  stopReadingPage = (options) => {
    if (!likelyNotABot || !this.currentPage || !this.startTime) return;
    const timeDiff = now() - this.startTime;
    /* Discard if page was only seen for <10 seconds */
    if (timeDiff > 10 * 1000 && !ignoredUrls.includes(this.currentPage)) {
      this.log(
        {
          url: this.currentPage,
          seconds: Math.min(4 * 60, Math.round(timeDiff / 1000 / 10) * 10),
          type: "page_view",
          referrer: this.referrer,
        },
        options
      );
      this.referrer = null;
      this.currentPage = null;
    }
    this.currentPage = null;
  };
  log = (data, options) => {
    this.queue.push(data);
    this.save();
    this.timer && clearTimeout(this.timer);
    if (options?.dontSync) return;
    if (this.queue.length > 15) {
      this.sync();
    } else {
      this.timer = setTimeout(this.sync, 1 * 1000);
    }
  };
  save = () => {
    saveInLocalStorage(
      ANALYTICS_LOCALSTORAGE_LABEL,
      this.queue.length > 0 ? this.queue : null
    );
  };
  sync = async (options) => {
    if (!options?.force && (!likelyNotABot || this.queue.length <= 1)) return;
    await axios.post(`/api/a`, {
      queue: this.queue.slice(0, 20),
    });
    this.queue = [];
    this.save();
  };
  error = () => {
    // TODO! Does not work as this results in an infinite loop
    // if (!likelyNotABot) return;
    // axios.post(`/api/error`, { message, url: window.location.pathname });
  };
  test = () => {
    if (process.env.NODE_ENV !== "development") return;
    this.queue.push({ url: "testing" });
    this.sync({ force: true });
  };
}
const analytics = new Analytics();
export default analytics;

if (isBrowser) {
  if (isDev) {
    window.analytics = analytics;
  }
  // window.addEventListener("blur", function () {
  //   // TextAnalytics.close();
  // });
  // window.addEventListener('focus', function() {
  // });
  window.onbeforeunload = function () {
    analytics.stopReadingPage({ dontSync: true });
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
}
