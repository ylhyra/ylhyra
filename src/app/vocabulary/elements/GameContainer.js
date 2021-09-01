import React, { Component } from "react";
import Card from "./Card";
import Progress from "./Progress";
import { connect } from "react-redux";
import {
  TextEventListenersOn,
  TextEventListenersOff,
} from "documents/read/touch";
import {
  isBrowser,
  hasLocalStorage,
  supportsTouch,
} from "app/app/functions/isBrowser";

class GameContainer extends Component {
  componentDidMount = () => {
    this.componentDidUpdate();
  };
  componentDidUpdate = () => {
    const { deck, session } = this.props.vocabulary;
    if (!deck.session.currentCard) {
      console.log(
        "No current card when GameContainer was loaded, initializing"
      );
      deck.session.InitializeSession();
    }
  };
  render() {
    // const { deck, status, session } = this.props.vocabulary;
    // if (!session) return null;
    return (
      <div id="game-container">
        <div className="vocabulary-card-outer-container">
          <Card />
        </div>
        <Progress />
      </div>
    );
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
}))(GameContainer);