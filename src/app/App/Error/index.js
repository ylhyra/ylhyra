import store from "app/App/store";
import React from "react";
import { connect } from "react-redux";
import messages from "./messages";
import Analytics from "app/Analytics";

const Notification = (props) => {
  if (!props.error) return null;
  let { message } = props.error;
  if (message in messages) {
    message = messages[message];
  }
  return <div className="notification error">{message}</div>;
};

export default connect((state) => ({
  error: state.error,
}))(Notification);

export const notify = (message) => {
  window.scrollTo(0, 0);
  Analytics.error(message);
  store.dispatch({
    type: "ERROR",
    content: {
      message: message,
    },
  });
};
