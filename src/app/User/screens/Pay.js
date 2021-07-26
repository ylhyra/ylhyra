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
              shape: "rect",
              color: "blue",
              layout: "horizontal",
              label: "pay",
            },

            createOrder: function (data, actions) {
              const price = parsePrice(
                document.querySelector("input[name=price]").value
              );
              return actions.order.create({
                purchase_units: [
                  {
                    payee: {
                      // email_address: "ylhyra@ylhyra.is",
                      email_address: "sb-ljrih5537425@business.example.com",
                      merchant_id: "sb-ljrih5537425@business.example.com",
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
                alert(
                  "Transaction completed by " +
                    details.payer.name.given_name +
                    "!"
                );
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
            pay(values);
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

              <div class="centered-button">
                <button type="submit" className="big" disabled={isSubmitting}>
                  Continue
                </button>
              </div>

              <div id="paypal-button-container"></div>
            </Form>
          )}
        </Formik>
        <form
          action="https://www.paypal.com/cgi-bin/webscr"
          method="post"
          target="_top"
        >
          {/* Identify your business so that you can collect the payments. */}
          <input
            type="hidden"
            name="business"
            value="Yourbusinessemail@paypal.com"
          />{" "}
          {/* Add your PayPal Seller/Business email address Required*/}
          {/* Specify a Buy Now button. */}
          <input type="hidden" name="cmd" value="_xclick" />
          {/* Specify details about the item that buyers will purchase. */}
          <input type="hidden" name="item_name" value="Ylhýra account" />{" "}
          {/* Add Description e.g your room type Required*/}
          <input type="hidden" name="amount" value="15" />{" "}
          {/* Dynamically add Total Amount Required*/}
          <input type="hidden" name="currency_code" value="USD" />{" "}
          {/* Update to your currency */}
          <input id="invoice" type="hidden" value="" name="invoice" />{" "}
          {/* Add Unique invoice for each transaction */}
          {/* <input
            type="hidden"
            name="notify_url"
            value="www.yourwebsite.com/ipn.php"
          />{" "} */}
          {/* Please add IPN URL You can use this service to automate back-office and administrative functions, including fulfilling orders, tracking customers, and providing status and other information related to transactions. */}
          <input type="hidden" name="cancel_return" value={`${url}/`} />{" "}
          {/* Take customers to this URL when they cancel their checkout */}
          <input
            type="hidden"
            name="return"
            value={`${url}/pwyw/thanks`}
          />{" "}
          {/* Take customers to this URL when they finish their checkout  */}
          {/* Display the payment button. */}
          <button type="submit" name="submit">
            Submit (test)
          </button>
        </form>
      </div>
    );
  }
}
export default connect((state) => ({
  user: state.user,
}))(Form2);
