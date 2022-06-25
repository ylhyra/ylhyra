import React from "react";
import { connect, ConnectedProps } from "react-redux";
import Analytics from "ylhyra/app/app/analytics";
import messages from "ylhyra/app/app/error/messages";
import store, { RootState } from "ylhyra/app/app/store";

const Notification = (props: ConnectedProps<typeof connector>) => {
  if (!props.error) return null;
  let { message } = props.error;
  if (message in messages) {
    // @ts-ignore
    message = messages[message];
  }
  return <div className="notification error">{message}</div>;
};

const connector = connect((state: RootState) => ({
  error: state.error,
}));
export default connector(Notification);

export function notify(message: string, type?: "error") {
  window.scrollTo(0, 0);
  Analytics.error(message);
  store.dispatch({
    type: "ERROR",
    content: {
      message: message,
    },
  });
}
