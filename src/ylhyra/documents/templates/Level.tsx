import React from "react";
import Link from "ylhyra/app/router/Link";

export default (props) => {
  return (
    <span className="level">
      Level <Link href={props.level}>{props.level.toUpperCase()}</Link>
    </span>
  );
};
