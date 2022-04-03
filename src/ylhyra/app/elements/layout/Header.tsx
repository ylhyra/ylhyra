import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "ylhyra/app/app/store";
import Link from "ylhyra/app/router/Link";
import { existsSchedule, isUserLoggedIn } from "ylhyra/app/user/actions";
import LoginButton from "ylhyra/app/user/LoginButton";

class Layout extends React.Component<ConnectedProps<typeof connector>> {
  render() {
    const notBanner = ["/login", "/signup"].includes(this.props.route.pathname);
    let className = "";
    if (this.props.route.pathname === "/vocabulary") {
      className = "brown-background";
    }
    return (
      <header className={className}>
        {!isUserLoggedIn() && existsSchedule() && !notBanner && (
          <Link href="/signup" className="notification please-log-in">
            Create an account to save your progress
          </Link>
        )}
        <div className="header-container">
          <div className="header-container-inner">
            <Link href="/" id="logo" />
            <NavLinks />
            {/* <div className="spacer" hidden /> */}
            <LoginButton />
          </div>
        </div>
        <div className="header-container-below hidden" hidden>
          <NavLinks />
        </div>
      </header>
    );
  }
}

const connector = connect((state: RootState) => ({
  route: state.route,
  vocabulary: state.vocabulary,
}));
export default connector(Layout);

const NavLinks = () => (
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
      {/*<li>*/}
      {/*  <Link href="/about">About</Link>*/}
      {/*</li>*/}
    </ul>
  </nav>
);