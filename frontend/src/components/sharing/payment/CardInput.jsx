import React from "react";
import { CardElement } from "@stripe/react-stripe-js";

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#aab7c4",
            },
            border: "1px solid red",
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
        },
    },
    wallets: { applePay: "auto" },
    hidePostalCode: true,
    classes: {
        webkitAutofill: "StripeElement--webkit-autofill",
    },
};

const CardInput = () => {
    return (
        <CardElement
            autocomplete="off"
            AfterpayClearpayMessageElement
            options={CARD_ELEMENT_OPTIONS}
        />
    );
};
export default CardInput;
    