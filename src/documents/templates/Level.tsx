import Link from "app/router/Link";
import React from "react";

export default (props) => {
  return (
    <span className="level">
      Level <Link href={props.level}>{props.level.toUpperCase()}</Link>
    </span>
  );
};
