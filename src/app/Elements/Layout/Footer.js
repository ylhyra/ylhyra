import React from "react";
import LoginButton from "app/User/LoginButton";
import Link from "app/Router/Link";

export default (props) => (
  <div id="footer">
    <div id="footer-info">
      <span className="footer-gray">
        <Link
          id="footer-logo"
          title="Kennitala: 480520-0170"
          href="/Project:About"
        >
          Ylhýra
        </Link>
      </span>
      •
      <span className="anonymous-show">
        <span className="footer-gray">
          <a href="http://inflections.ylhyra.is/">Look up inflections</a>
        </span>
        •
        <span className="footer-gray">
          <a href="mailto:ylhyra@ylhyra.is">Report errors</a>
        </span>
        {/* •
        <span className="footer-gray">
          <Link href="/Project:Become_a_collaborator">Collaborate</Link>
        </span> */}
        •
        <span className="footer-gray">
          {process.env.NODE_ENV === "development" && (
            <Link href="/donate">Donate</Link>
          )}
        </span>
        {/* • */}
      </span>
      {/* <span className="footer-gray">
      <a href="/Special:Search">Search</a>
      </span> */}
    </div>
  </div>
);
