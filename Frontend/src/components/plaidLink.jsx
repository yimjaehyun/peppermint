import React, { Component } from "react";
import { useEffect } from "react";

// Need to pass in userId to post and {user and setUser} to update accounts
// components
export default function PlaidLink({ user, setUser }) {
    const linkHandler = () => {
        var handler = window.Plaid.create({
            clientName: "Peppermint",
            env: process.env.REACT_APP_PLAID_ENV,
            key: process.env.REACT_APP_PUBLIC_KEY,
            product: ["transactions"],
            onLoad: function() {
                // Optional, called when Link loads
            },
            onSuccess: function(public_token, metadata) {
                // Send the public_token to your app server.
                // The metadata object contains info about the institution the
                // user selected and the account ID or IDs, if the
                // Select Account view is enabled.
                fetch("/api/plaid/get_access_token/", {
                    method: "post",
                    mode: "cors",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user.id,
                        public_token: public_token,
                        metadata: metadata
                    })
                }).then(response => {
                    response.json().then(function(data) {
                        setUser({
                            ...user,
                            accounts: [
                                ...user.accounts,
                                {
                                    accessToken: data.access_token,
                                    metadata: metadata
                                }
                            ]
                        });
                    });
                });
            },
            onExit: function(err, metadata) {
                // The user exited the Link flow.
                if (err != null) {
                    // The user encountered a Plaid API error prior to exiting.
                }
                // metadata contains information about the institution
                // that the user selected and the most recent API request IDs.
                // Storing this information can be helpful for support.
            },
            onEvent: function(eventName, metadata) {
                // Optionally capture Link flow events, streamed through
                // this callback as your users connect an Item to Plaid.
                // For example:
                // eventName = "TRANSITION_VIEW"
                // metadata  = {
                //   link_session_id: "123-abc",
                //   mfa_type:        "questions",
                //   timestamp:       "2017-09-14T14:42:19.350Z",
                //   view_name:       "MFA",
                // }
            }
        });

        handler.open();
    };

    useEffect(() => {
        const script = document.createElement("script");

        script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
        script.async = true;

        document.body.appendChild(script);
    }, []);

    return (
        <div>
            <button onClick={linkHandler} id="link-button">
                Link Account
            </button>
        </div>
    );
}
