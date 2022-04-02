import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "ylhyra/app/app/store";
import Link from "ylhyra/app/router/Link";

const Button = (props: ConnectedProps<typeof connector>) => {
  return (
    <div className="login-buttons">
      {props.user ? (
        <Link href="/settings" className="logged-in-as">
          Logged in as{" "}
          <b>
            {props.user.username.length > 20
              ? props.user.username.slice(0, 15) + "..."
              : props.user.username}
          </b>
        </Link>
      ) : (
        <div>
          <Link href="/login" className="login">
            Log&nbsp;in
          </Link>
          <Link href="/signup" className="signup">
            Sign&nbsp;up
          </Link>
        </div>
      )}
    </div>
  );
};

const connector = connect((state: RootState) => ({
  user: state.user,
}));
export default connector(Button);
