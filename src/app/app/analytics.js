"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
  Tracks time spent on page
*/
const axios_1 = __importDefault(require("app/app/axios"));
const isBrowser_1 = require("app/app/functions/isBrowser");
const isDev_1 = require("app/app/functions/isDev");
const localStorage_1 = require("app/app/functions/localStorage");
const math_1 = require("app/app/functions/math");
const time_1 = require("app/app/functions/time");
const ignoredUrls = ["/", "/frontpage"];
let likelyNotABot = null;
class Analytics {
    constructor() {
        this.timer = null;
        this.startTime = null;
        this.currentPage = null;
        this.queue = (0, localStorage_1.getFromLocalStorage)(localStorage_1.ANALYTICS_LOCALSTORAGE_LABEL) || [];
        this.errorSent = null;
        this.referrer = (() => {
            if (!isBrowser_1.isBrowser)
                return;
            const referrer_id = new URL(window.location.href).searchParams.get("a");
            if (referrer_id) {
                return referrer_id;
            }
            if (document.referrer && !document.referrer.includes("//ylhyra.is")) {
                return document.referrer;
            }
        })();
        this.startReadingPage = (url) => {
            if (url === this.currentPage)
                return;
            this.stopReadingPage();
            this.currentPage = url;
            this.startTime = (0, time_1.getTime)();
        };
        this.stopReadingPage = (options) => {
            if (!likelyNotABot || !this.currentPage || !this.startTime)
                return;
            const timeDiff = (0, time_1.getTime)() - this.startTime;
            if (this.referrer ||
                (timeDiff > 10 * time_1.seconds && !ignoredUrls.includes(this.currentPage))) {
                this.log({
                    url: this.currentPage,
                    /* The max stored value is 5 minutes (300 seconds) */
                    seconds: Math.min(300, (0, math_1.roundToInterval)(timeDiff / time_1.seconds, 10)),
                    type: "page_view",
                    referrer: this.referrer,
                }, options);
                this.referrer = null;
                this.currentPage = null;
            }
            this.currentPage = null;
        };
        this.log = (data, options) => {
            this.queue.push(Object.assign(Object.assign({}, data), { timestamp: data.timestamp || (0, time_1.getTime)() }));
            this.save();
            this.timer && clearTimeout(this.timer);
            if (options === null || options === void 0 ? void 0 : options.dontSync)
                return;
            if (this.queue.length >= 3) {
                void this.sync();
            }
        };
        this.save = () => {
            (0, localStorage_1.saveInLocalStorage)(localStorage_1.ANALYTICS_LOCALSTORAGE_LABEL, this.queue.length > 0 ? this.queue : null);
        };
        this.sync = (options) => __awaiter(this, void 0, void 0, function* () {
            if (!(options === null || options === void 0 ? void 0 : options.force) && (!likelyNotABot || this.queue.length <= 1))
                return;
            yield axios_1.default.post(`/api/a`, {
                queue: this.queue.slice(0, 20),
            });
            this.queue = [];
            this.save();
        });
        this.error = (message) => {
            if (!likelyNotABot)
                return;
            /* Limit to reporting a single error to prevent infinite loops */
            if (this.errorSent)
                return;
            setTimeout(() => {
                axios_1.default.post(`/api/error`, { message, url: window.location.pathname });
            }, 4000);
            this.errorSent = true;
        };
        this.test = () => {
            if (process.env.NODE_ENV !== "development")
                return;
            this.queue.push({ url: "testing" });
            this.sync({ force: true });
        };
    }
}
const analytics = new Analytics();
exports.default = analytics;
if (isBrowser_1.isBrowser) {
    if (isDev_1.isDev) {
        window["analytics"] = analytics;
    }
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
