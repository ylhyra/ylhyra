import React, { Component } from "react";
import { connect } from "react-redux";
import Link from "app/Router/Link";
import Button from "documents/Templates/Button";
import { InitializeSession } from "app/Vocabulary/actions/session";
import { updateURL } from "app/Router/actions";
import {
  MakeSummaryOfCardStatuses,
  PercentageKnown,
  getCardIdsFromWords,
} from "app/Vocabulary/actions/_functions";
import createCards from "app/Vocabulary/actions/createCards";
import Section from "documents/Templates/Section.js";
class X extends Component {
  getCards = () => {
    const vocabulary_list = this.props.header_data.vocabulary;
    if (!vocabulary_list) return null;
    return getCardIdsFromWords(vocabulary_list);
  };
  run = () => {
    const { deck } = this.props.vocabulary;
    const cards = createCards({ allowed_card_ids: this.getCards() }, deck); //.map(id => deck.cards[id])
    InitializeSession(cards, deck);
    updateURL("/vocabulary/play");
  };
  render() {
    if (this.props.route.pathname === "/") return null;
    const vocabulary_list =
      this.props.header_data && this.props.header_data.vocabulary;
    const { deck } = this.props.vocabulary;
    if (!vocabulary_list || !deck) return null;
    const cards = this.getCards();
    if (cards.length === 0) return null;
    if (this.props.button === false) {
      return (
        <small className="gray">{PercentageKnown(cards, deck)}% known</small>
      );
    }
    return (
      <Section>
        <div>{PercentageKnown(cards, deck)}% known</div>
        {/* <div>{JSON.stringify(MakeSummaryOfCardStatuses(cards, deck))}</div> */}
        <button onClick={this.run}>Study {cards.length} cards</button>
      </Section>
    );
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
  route: state.route,
}))(X);
