import { notify } from "app/App/Error";
import axios from "axios";

import axiosRetry from "axios-retry";

axiosRetry(axios, {
  retries: 2,
  retryDelay: (retryCount) => {
    console.log(`Retrying to connect to server: ${retryCount}`);
    return retryCount * 2000;
  },
  retryCondition: (error) => {
    // return error.response.status === 503;
  },
});

axios.defaults.timeout = 5000;
axios.interceptors.response.use(
  function (success) {
    return success;
  },
  function (error) {
    let message;
    const response = error.response && error.response.data;
    const status = error.response && error.response.status;
    if (typeof response === "object") {
      message = response.message || response.error;
    }
    if (typeof message !== "string") {
      message = "Server returned an error";
    }
    if (status !== 404) {
      notify(message, "error");
    }
    console.log(error);
    return Promise.reject(error);
  }
);

export default axios;
