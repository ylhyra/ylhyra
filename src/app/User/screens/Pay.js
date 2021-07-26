import { connect } from "react-redux";
import React from "react";
import Link from "app/Router/Link";

import { updateURL } from "app/Router/actions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { pay, parsePrice, MAX_PRICE } from "app/User/actions";
import { loadScript } from "@paypal/paypal-js";
const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://ylhyra.is";

class Form2 extends React.Component {
  componentDidMount() {
    if (!this.props.user) {
      updateURL("SIGN_UP");
    }
    loadScript({
      "client-id":
        "AaRxrdnGTCs8AD-yCjbvRq9bpMK5XT40mArnKz4wcExDVpEo8a7lHp_g8hikcvbCvuwloOQcl8Amx1LK",
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

            createOrder: function (data, actions) {
              const price = parsePrice(
                document.querySelector("input[name=price]").value
              );
              console.log({ price });
              if (price.error) return;
              return actions.order.create({
                purchase_units: [
                  {
                    payee: {
                      // email_address: "ylhyra@ylhyra.is",
                      email_address: "sb-ljrih5537425@business.example.com",
                      merchant_id: "7T9P5T6VVL8PC",
                    },
                    description: "Material for students of Icelandic",
                    // items: ["An account at ylhyra.is"],
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
                console.log(details);
                // alert(
                //   "Transaction completed by " +
                //     details.payer.name.given_name +
                //     "!"
                // );
              });
            },

            onError: function (err) {
              // TODO
              console.log(err);
            },
          })
          .render("#paypal-button-container");
      })
      .catch((err) => {
        console.error("failed to load the PayPal JS SDK script", err);
      });
  }
  shouldComponentUpdate = () => false;
  render() {
    return (
      <div id="pwyw-form">
        <Formik
          initialValues={{ price: 20 }}
          validate={(values) => {
            const errors = {};
            const price = parsePrice(values.price);
            if (price && price.error !== "TOO_SMALL") {
              if (price.error === "INVALID_NUMBER") {
                errors.price = `Please enter a valid number`;
              } else if (price.error === "TOO_LARGE") {
                errors.price = `Thank you for your generosity, but the maximum allowed value is $${MAX_PRICE}.`;
              }
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            // pay(values);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <label>
                <div>Enter amount: </div>
                <div class="shared-input">
                  <Field type="text" name="price" />
                  <div>U.S. dollars</div>
                </div>
                <ErrorMessage name="price" className="error" component="div" />
              </label>

              {/* <div class="centered-button">
                <button type="submit" className="big" disabled={isSubmitting}>
                  Continue
                </button>
              </div> */}

              <div id="paypal-button-container"></div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
export default connect((state) => ({
  user: state.user,
}))(Form2);
