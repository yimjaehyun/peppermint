const express = require("express");
const moment = require("moment");
const plaid = require("plaid");
const User = require("../models/user");
const router = express.Router();

require("dotenv").config();

const PLAID_CLIENT_ID = process.env.CLIENT_ID;
const PLAID_SECRET = process.env.SECRET;
const PLAID_PUBLIC_KEY = process.env.PUBLIC_KEY;
const PLAID_ENV = process.env.ENV;
var PLAID_PRODUCTS = ["transactions"];
var PLAID_COUNTRY_CODES = ["US"];

// Initialize the Plaid client
// Find your API keys in the Dashboard (https://dashboard.plaid.com/account/keys)
var client = new plaid.Client(
    PLAID_CLIENT_ID,
    PLAID_SECRET,
    PLAID_PUBLIC_KEY,
    plaid.environments[PLAID_ENV],
    { version: "2019-05-29", clientApp: "Peppermint" }
);

// Exchange token flow - exchange a Link public_token for
// an API access_token
// https://plaid.com/docs/#exchange-token-flow
router.post("/get_access_token", function(request, response, next) {
    client.exchangePublicToken(request.body.public_token, function(
        error,
        tokenResponse
    ) {
        if (error != null) {
            return response.json({
                error: error
            });
        }
        var ACCESS_TOKEN = tokenResponse.access_token;
        var ITEM_ID = tokenResponse.item_id;

        User.findOneAndUpdate(
            { _id: request.body.userId },
            {
                $push: {
                    accounts: {
                        itemId: ITEM_ID,
                        accessToken: ACCESS_TOKEN,
                        metadata: request.body.metadata
                    }
                }
            },
            { useFindAndModify: false }
        ).then(
            user => {
                response.json({
                    access_token: ACCESS_TOKEN,
                    error: null
                });
            },
            err => {
                console.log(err);
            }
        );
    });
});

// Retrieve Transactions for an Item
// https://plaid.com/docs/#transactions
router.get("/transactions", function(request, response, next) {
    // Pull transactions for the Item for the last 30 days
    var startDate = moment()
        .subtract(30, "days")
        .format("YYYY-MM-DD");
    var endDate = moment().format("YYYY-MM-DD");
    client.getTransactions(
        request.header("Access-Token"),
        startDate,
        endDate,
        {
            count: 250,
            offset: 0
        },
        function(error, transactionsResponse) {
            if (error != null) {
                console.log(error);
                return response.json({
                    error: error
                });
            } else {
                console.log(transactionsResponse);
                response.json({
                    error: null,
                    transactions: transactionsResponse
                });
            }
        }
    );
});

module.exports = router;
