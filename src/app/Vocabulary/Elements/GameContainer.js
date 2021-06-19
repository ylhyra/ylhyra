import React, { Component } from "react";
import Card from "./Card";
import Progress from "./Progress";
import { connect } from "react-redux";
import {
  TextEventListenersOn,
  TextEventListenersOff,
} from "documents/Read/Touch/";
import {
  isBrowser,
  hasLocalStorage,
  supportsTouch,
} from "app/App/functions/isBrowser";

class GameContainer extends Component {
  componentDidMount = () => {
    this.componentDidUpdate();
  };
  componentDidUpdate = () => {
    const { deck, session } = this.props.vocabulary;
    if (deck && !session) {
      deck.generateSession();
    }
  };
  render() {
    const { status, session } = this.props.vocabulary;
    if (!session) return null;
    return (
      <div id="game-container">
        <div className="vocabulary-card-outer-container">
          <Card />
        </div>
        {session.printTimeRemaining()}
        <Progress />
      </div>
    );
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
}))(GameContainer);
