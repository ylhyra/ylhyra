import React from "react";
import Link from "ylhyra/app/router/Link";

export default () => (
  <div id="footer">
    <div id="footer-info">
      <span className="footer-gray">
        <Link href="/about">About</Link>
      </span>
      •
      <span className="anonymous-show">
        <span className="footer-gray">
          <a href="https://inflections.ylhyra.is/">Look up inflections</a>
        </span>
        •
        <span className="footer-gray">
          <a href="mailto:ylhyra@ylhyra.is">Report&nbsp;errors</a>
        </span>
      </span>
    </div>
  </div>
);
