import { log } from "modules/log";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RECOMMENDED_PRICE_IN_US_DOLLARS } from "ylhyra/app/app/constants";
import { RootState } from "ylhyra/app/app/store";
import { goToUrl } from "ylhyra/app/router/actions/goToUrl";
import {
  continueAfterPaying,
  MAX_PRICE,
  MIN_PRICE,
  parsePrice,
} from "ylhyra/app/user/payments/actions";
import { PayPalButton } from "ylhyra/app/user/payments/PayPalButton";

class Form2 extends React.Component<ConnectedProps<typeof connector>> {
  state = {
    price: RECOMMENDED_PRICE_IN_US_DOLLARS,
  };
  componentDidMount() {
    // log({
    //   u: this.props.user,
    //   off: !process.env.REACT_APP_PWYW,
    // });
    if (!this.props.user || !process.env.REACT_APP_PWYW) {
      setTimeout(() => {
        goToUrl("/signup");
      }, 100);
    }
  }
  onChange = (e) => {
    this.setState({ price: e.target.value });
    const price = parsePrice(e.target.value);
    log(price);
    if (price.error) {
      window.PayPalButtonActions?.disable();
      if (price.error === "TOO_SMALL") {
        this.setState({ error: "TOO_SMALL" });
      } else if (price.error === "INVALID_NUMBER") {
        this.setState({ error: `Please enter a valid number` });
      } else if (price.error === "TOO_LARGE") {
        this.setState({
          error: `Thank you for your generosity, but the maximum allowed value is $${MAX_PRICE}.`,
        });
      }
    } else if (this.state.error) {
      window.PayPalButtonActions?.enable();
      this.setState({ error: null });
    }
  };
  render() {
    return (
      <div id="pwyw-form">
        <label>
          <div>Enter amount: </div>
          <div className="shared-input">
            <input
              type="text"
              name="price"
              value={this.state.price}
              onChange={this.onChange}
              autoFocus="autofocus"
            />
            <div>U.S. dollars</div>
          </div>
          <div className="form-error">
            {this.state.error !== "TOO_SMALL" && this.state.error} &nbsp;
          </div>
        </label>
        <div
          style={{
            display: this.state.error === "TOO_SMALL" ? "none" : "block",
            opacity: this.state.error ? 0.3 : 1,
          }}
        >
          <PayPalButton key={1} />
        </div>
        {this.state.error === "TOO_SMALL" && (
          <div className="centered-button">
            <button
              type="button"
              className="big"
              onClick={() =>
                continueAfterPaying({
                  price: 0,
                })
              }
            >
              Continue
            </button>
            {parseInt(this.state.price.trim() || 0) !== 0 && (
              <div className="gray small center">
                The smallest amount that can be processed is ${MIN_PRICE}, you
                won't be charged.
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const connector = connect((state: RootState) => ({
  user: state.user,
}));
export default connector(Form2);