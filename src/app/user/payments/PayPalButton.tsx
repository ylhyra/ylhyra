import { notify } from "app/app/error";
import { isBrowser } from "app/app/functions/isBrowser";
import { log } from "app/app/functions/log";
import { updateURL } from "app/router/actions/updateURL";
import { continueAfterPaying, parsePrice } from "app/user/payments/actions";
import React from "react";

let button;

export class PayPalButton extends React.Component {
  async componentDidMount() {
    if (!process.env.REACT_APP_PWYW || !process.env.REACT_APP_PP_CLIENT_ID)
      return;
    const loadPayPalScript = (
      await import(
        /* webpackChunkName: "paypal" */
        "@paypal/paypal-js"
      )
    ).loadScript;

    console.log("LOADING");

    /* Clear */
    // document.getElementById("paypal-button-container").innerHTML = "";
    loadPayPalScript({
      "client-id": process.env.REACT_APP_PP_CLIENT_ID,
    })
      .then((paypal) => {
        /* TODO: Mjög skrýtið, ef maður byrjar á PWYW skjánum, skráir sig út og býr til nýjan aðgang er componentDidMount() kallað tvisvar!! */
        button?.close();
        button = paypal.Buttons({
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
            log(price);
            if (price.error) return;
            return actions.order.create({
              purchase_units: [
                {
                  payee: {
                    // email_address: process.env.REACT_APP_PAYPAL_EMAIL,
                    merchant_id: process.env.REACT_APP_MERCHANT_ID,
                  },
                  description:
                    "An account at Ylhýra.is, an Icelandic language-learning website",
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
              continueAfterPaying({
                price,
                transaction_id: details.id,
              });
              paypal.Buttons().close();
              log(details);
              // alert(
              //   "Transaction completed by " +
              //     details.payer.name.given_name +
              //     "!"
              // );
            });
          },

          onError: function (err) {
            log(err);
            // notify("Sorry, an error has come up.");
          },
        });
        button.render("#paypal-button-container");
      })
      .catch((err) => {
        console.error(err);
        notify("Sorry, an error has come up. Feel free to skip this step.");
      });
  }
  componentWillUnmount() {
    button?.close();
  }
  // shouldComponentUpdate = () => false;
  render() {
    return <div id="paypal-button-container" />;
  }
}

const getPriceFromInput = () =>
  parsePrice(document.querySelector("input[name=price]").value);

if (isBrowser) {
  window.haha = () => {
    updateURL("/vocabulary");
    setTimeout(() => {
      updateURL("/pwyw");
    }, 1000);
  };
}
