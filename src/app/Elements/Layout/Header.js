import React from "react";
import LoginButton from "app/User/LoginButton";
import Link from "app/Router/Link";

export default (props) => (
  <header>
    <div>
      <Link href="/" id="logo"></Link>
      <ul>
        <li>
          <Link href="/spænska">Spænska</Link>
        </li>
        <li>
          <Link href="/texts">Texts</Link>
        </li>
        <li>
          <Link href="/vocabulary">Vocabulary</Link>
        </li>
        <li>
          <Link href="/course">Course</Link>
        </li>
        <li>
          <Link href="/explanations">Explanations</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
      </ul>
      <ul>
        <li>
          <LoginButton />
        </li>
      </ul>
    </div>
  </header>
);
