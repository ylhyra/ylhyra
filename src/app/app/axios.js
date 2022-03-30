"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("app/app/error");
const log_1 = require("app/app/functions/log");
const axios_1 = __importDefault(require("axios"));
// import axiosRetry from "axios-retry";
// axiosRetry(axios, {
//   retries: 2,
//   retryDelay: (retryCount) => {
//     log(`Retrying to connect to server: ${retryCount}`);
//     return retryCount * 2000;
//   },
//   retryCondition: (error) => {
//     // return error.response.status === 503;
//   },
// });
axios_1.default.defaults.timeout = 5000;
axios_1.default.interceptors.response.use(function (success) {
    return success;
}, function (error) {
    var _a, _b;
    let message;
    const response = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data;
    const status = (_b = error.response) === null || _b === void 0 ? void 0 : _b.status;
    if (typeof response === "object") {
        message = response.message || response.error;
    }
    if (typeof message !== "string") {
        message = "Server returned an error. Please try reloading.";
    }
    if (status !== 404) {
        (0, error_1.notify)(message, "error");
    }
    (0, log_1.log)(error);
    return Promise.reject(error);
});
exports.default = axios_1.default;
