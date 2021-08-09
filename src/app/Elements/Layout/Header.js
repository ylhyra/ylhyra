import React from "react";
import LoginButton from "app/User/LoginButton";
import Link from "app/Router/Link";
import { isUserLoggedIn, existsSchedule } from "app/User/actions";
import { connect } from "react-redux";

class Layout extends React.Component {
  render() {
    const not_banner = ["/login", "/signup"].includes(
      this.props.route.pathname
    );
    return (
      <header>
        {!isUserLoggedIn() && existsSchedule() && !not_banner && (
          <Link href="/sign-up" className="notification please-log-in">
            Create an account to save your progress
          </Link>
        )}
        <div className="header-container">
          <div className="header-container-inner">
            <Link href="/" id="logo" />
            <Navlinks />
            {/* <div className="spacer" hidden /> */}
            <LoginButton />
          </div>
        </div>
        <div className="header-container-below hidden" hidden>
          <Navlinks />
        </div>
      </header>
    );
  }
}
export default connect((state) => ({
  route: state.route,
  vocabulary: state.vocabulary,
}))(Layout);

const Navlinks = () => (
  <nav className="navlinks">
    <ul>
      {/* <li>
      <Link href="/spænska">Spænska</Link>
    </li> */}
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
        <Link href="/texts">Texts</Link>
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
  </nav>
);
