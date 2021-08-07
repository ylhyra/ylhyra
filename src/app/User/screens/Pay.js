import { notify } from "app/App/Error";
import { connect } from "react-redux";
import React from "react";
import Link from "app/Router/Link";

import { updateURL } from "app/Router/actions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  continueAfterPaying,
  parsePrice,
  MAX_PRICE,
  MIN_PRICE,
} from "app/User/actions";

const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://ylhyra.is";

class Form2 extends React.Component {
  state = {
    price: 20,
  };
  componentDidMount() {
    if (!this.props.user) {
      updateURL("SIGN_UP");
    }
  }
  onChange = (e) => {
    this.setState({ price: e.target.value });
    const price = parsePrice(e.target.value);
    process.env.NODE_ENV === "development" && console.log(price);
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
          <PayPalButton />
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
export default connect((state) => ({
  user: state.user,
}))(Form2);

class PayPalButton extends React.Component {
  async componentDidMount() {
    const loadPayPalScript = (
      await import(
        /* webpackChunkName: "paypal" */
        "@paypal/paypal-js"
      )
    ).loadScript;
    loadPayPalScript({
      "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
    })
      .then((paypal) => {
        paypal
          .Buttons({
            style: {
              size: "small",
              shape: "rect",
              color: "blue",
              layout: "horizontal",
              funding: { disallowed: [paypal.FUNDING.CREDIT] },
              tagline: false,
              label: "pay",
            },
            onInit: function (data, actions) {
              window.PayPalButtonActions = actions;
            },
            onClick: function (data, actions) {
              const price = getPriceFromInput();
              if (price.error) {
                return actions.reject();
              } else {
                return actions.resolve();
              }
            },

            createOrder: function (data, actions) {
              const price = getPriceFromInput();
              console.log(price);
              if (price.error) return;
              return actions.order.create({
                purchase_units: [
                  {
                    payee: {
                      email_address: process.env.REACT_APP_PAYPAL_EMAIL,
                      merchant_id: process.env.REACT_APP_MERCHANT_ID,
                    },
                    description: "Icelandic language-learning material",
                    amount: {
                      currency_code: "USD",
                      value: price,
                    },
                  },
                ],
                application_context: {
                  shipping_preference: "NO_SHIPPING",
                },
              });
            },

            onApprove: function (data, actions) {
              return actions.order.capture().then(function (details) {
                const price = getPriceFromInput();
                const transaction_id = details.id;
                continueAfterPaying({
                  price,
                  transaction_id: details.id,
                });
                paypal.Buttons().close();
                console.log(details);
                // alert(
                //   "Transaction completed by " +
                //     details.payer.name.given_name +
                //     "!"
                // );
              });
            },

            onError: function (err) {
              console.log(err);
              notify("Sorry, an error has come up.");
            },
          })
          .render("#paypal-button-container");
      })
      .catch((err) => {
        console.error(err);
        notify("Sorry, an error has come up. Feel free to skip this step.");
      });
  }
  shouldComponentUpdate = () => false;
  render() {
    return <div id="paypal-button-container"></div>;
  }
}
const getPriceFromInput = () =>
  parsePrice(document.querySelector("input[name=price]").value);
