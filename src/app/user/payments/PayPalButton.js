"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayPalButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const error_1 = require("app/app/error");
const isBrowser_1 = require("app/app/functions/isBrowser");
const log_1 = require("app/app/functions/log");
const updateURL_1 = require("app/router/actions/updateURL");
const actions_1 = require("app/user/payments/actions");
const react_1 = __importDefault(require("react"));
let button;
class PayPalButton extends react_1.default.Component {
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!process.env.REACT_APP_PWYW || !process.env.REACT_APP_PP_CLIENT_ID)
                return;
            const loadPayPalScript = (yield Promise.resolve().then(() => __importStar(require(
            /* webpackChunkName: "paypal" */
            "@paypal/paypal-js")))).loadScript;
            console.log("LOADING");
            /* Clear */
            // document.getElementById("paypal-button-container").innerHTML = "";
            loadPayPalScript({
                "client-id": process.env.REACT_APP_PP_CLIENT_ID,
            })
                .then((paypal) => {
                /* TODO: Mjög skrýtið, ef maður byrjar á PWYW skjánum, skráir sig út og býr til nýjan aðgang er componentDidMount() kallað tvisvar!! */
                button === null || button === void 0 ? void 0 : button.close();
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
                        }
                        else {
                            return actions.resolve();
                        }
                    },
                    createOrder: function (data, actions) {
                        const price = getPriceFromInput();
                        (0, log_1.log)(price);
                        if (price.error)
                            return;
                        return actions.order.create({
                            purchase_units: [
                                {
                                    payee: {
                                        // email_address: process.env.REACT_APP_PAYPAL_EMAIL,
                                        merchant_id: process.env.REACT_APP_MERCHANT_ID,
                                    },
                                    description: "An account at Ylhýra.is, an Icelandic language-learning website",
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
                            (0, actions_1.continueAfterPaying)({
                                price,
                                transaction_id: details.id,
                            });
                            paypal.Buttons().close();
                            (0, log_1.log)(details);
                            // alert(
                            //   "Transaction completed by " +
                            //     details.payer.name.given_name +
                            //     "!"
                            // );
                        });
                    },
                    onError: function (err) {
                        (0, log_1.log)(err);
                        // notify("Sorry, an error has come up.");
                    },
                });
                button.render("#paypal-button-container");
            })
                .catch((err) => {
                console.error(err);
                (0, error_1.notify)("Sorry, an error has come up. Feel free to skip this step.");
            });
        });
    }
    componentWillUnmount() {
        button === null || button === void 0 ? void 0 : button.close();
    }
    // shouldComponentUpdate = () => false;
    render() {
        return (0, jsx_runtime_1.jsx)("div", { id: "paypal-button-container" });
    }
}
exports.PayPalButton = PayPalButton;
const getPriceFromInput = () => (0, actions_1.parsePrice)(document.querySelector("input[name=price]").value);
if (isBrowser_1.isBrowser) {
    window.haha = () => {
        (0, updateURL_1.updateURL)("/vocabulary");
        setTimeout(() => {
            (0, updateURL_1.updateURL)("/pwyw");
        }, 1000);
    };
}
