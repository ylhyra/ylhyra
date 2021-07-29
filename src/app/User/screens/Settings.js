import React from "react";
import { logout } from "app/User/actions";

export default () => (
  <div className="centered-button">
    <button className="big" onClick={logout}>
      Log out
    </button>
  </div>
);
