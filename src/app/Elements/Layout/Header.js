import React from "react";
import LoginButton from "app/User/LoginButton";
import Link from "app/Router/Link";

export default (props) => (
  <header>
    <div>
      <Link href="/" id="logo"></Link>
      <div className="navlinks">
        <ul>
          {/* <li>
          <Link href="/spænska">Spænska</Link>
        </li> */}
          <li>
            <Link href="/texts">Texts</Link>
          </li>
          <li>
            <Link href="/vocabulary">
              <span className="large">Vocabulary</span>
              <span className="medium">Vocab.</span>
            </Link>
          </li>
          <li>
            <Link href="/course">Course</Link>
          </li>
          <li>
            <Link href="/explanations">
              <span className="large">Explanations</span>
              <span className="medium">Expl.</span>
            </Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </div>
      <ul>
        <li>
          <LoginButton />
        </li>
      </ul>
    </div>
  </header>
);
