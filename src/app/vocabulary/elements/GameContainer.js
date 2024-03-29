import { log } from "app/app/functions/log";
import React, { Component } from "react";
import Card from "app/vocabulary/elements/CardElement";
import Progress from "app/vocabulary/elements/Progress";
import { connect } from "react-redux";

class GameContainer extends Component {
  componentDidMount = () => {
    this.componentDidUpdate();
  };
  componentDidUpdate = () => {
    const { deck } = this.props.vocabulary;
    if (!deck.session.currentCard) {
      log(
        "No current cardInSession when GameContainer was loaded, initializing"
      );
      deck.session.InitializeSession();
    }
  };
  render() {
    // const { deck, status, session } = this.props.vocabulary;
    // if (!session) return null;
    const { card } = this.props.vocabulary;

    return (
      <div id="game-container">
        <div className="vocabulary-card-outer-container">
          <Card key={card.counter} />
        </div>
        <Progress />
      </div>
    );
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
}))(GameContainer);
