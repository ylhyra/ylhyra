import React from "react";
import { connect } from "react-redux";
import Analytics from "ylhyra/app/app/analytics";
import messages from "ylhyra/app/app/error/messages";
import store, { RootState } from "ylhyra/app/app/store";

const Notification = (props) => {
  if (!props.error) return null;
  let { message } = props.error;
  if (message in messages) {
    message = messages[message];
  }
  return <div className="notification error">{message}</div>;
};

export default connect((state: RootState) => ({
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
