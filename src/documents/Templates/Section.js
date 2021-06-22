import React from "react";
export default (props) => (
  <section className={props.className}>
    <div>{props.children}</div>
  </section>
);
