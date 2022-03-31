import axios from "axios";

axios.defaults.timeout = 5000;
axios.interceptors.response.use(
  /**
   * Return data immediately upon a successful response
   */
  function (response) {
    return response.data;
  },
  function (error) {
    let message;
    const response = error.response?.data;
    const status = error.response?.status;
    if (typeof response === "object") {
      message = response.message || response.error;
      if (response.error) {
        return Promise.reject(response.error);
      }
    }
    if (typeof message !== "string") {
      message = "Server returned an error. Please try reloading.";
    }
    if (status !== 404) {
      // notify(message, "error");
    }
    return Promise.reject(error);
  }
);

const axios2 = axios;
export default axios2;
