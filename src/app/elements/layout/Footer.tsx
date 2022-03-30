import Link from "app/router/Link";
import React from "react";

export default () => (
  <div id="footer">
    <div id="footer-info">
      <span className="footer-gray">
        {/*<Link id="footer-logo" href="/about">*/}
        {/*  Ylhýra*/}
        {/*</Link>*/}

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
        {/* •
      <span className="footer-gray">
        <Link href="/Project:Become_a_collaborator">Collaborate</Link>
      </span> */}
        <span className="pwyw-on">
          •
          <span className="footer-gray">
            <Link href="/donate">Donate</Link>
          </span>
        </span>
        {/* • */}
      </span>
      {/* <span className="footer-gray">
    <a href="/Special:Search">Search</a>
    </span> */}
    </div>
  </div>
);
