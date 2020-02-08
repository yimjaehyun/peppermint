import React, { Fragment } from "react";
import PlaidLink from "../components/plaidLink";
import DateFilter from "../components/dateFilter";
import AppMenuBar from "../components/appBar";
import AccountFilter from "../components/accountFilter";
import Chart from "../components/charts";
import { useEffect } from "react";

import "../css/dashboard.css";
import transitions from "@material-ui/core/styles/transitions";

export default function Dashboard({ token }) {
    const [user, setUser] = React.useState({
        id: "",
        name: "",
        email: "",
        register_date: "",
        accounts: []
    });
    const [currentFilter, setCurrentFilter] = React.useState({
        date: "Month",
        account: "All"
    });
    // a dictionary of key: category name and value: [transactions]
    const [
        categorizedTransactions,
        setCategorizedTransactions
    ] = React.useState({});
    const [formattedTransactions, setFormattedTransactions] = React.useState(
        []
    );

    // Swap out jwt token for user
    useEffect(() => {
        fetch("/api/auth/user/", {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": token
            }
        })
            .then(function(res) {
                return res.json();
            })
            .then(function(data) {
                setUser({
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    register_date: data.register_date,
                    accounts: data.accounts
                });
            });
    }, []);

    // Fetch plaid transactions api and load transaction state
    useEffect(() => {
        const sortByCategory = transactionsArray => {
            var sortedDict = {};
            transactionsArray.forEach(transaction => {
                // Get first category since Plaid has multiple synonyms
                var category = transaction.category[0];
                if (category in sortedDict) {
                    sortedDict[category].push(transaction);
                } else {
                    sortedDict[category] = [transaction];
                }
            });
            return sortedDict;
        };

        if (user.accounts.length != 0) {
            user.accounts.forEach(a => {
                fetch("/api/plaid/transactions/", {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Token": a.accessToken
                    }
                })
                    .then(function(res) {
                        return res.json();
                    })
                    .then(function(data) {
                        setCategorizedTransactions(
                            sortByCategory(data.transactions.transactions)
                        );
                    });
            });
        }
    }, [user.accounts]);

    // Filter transaction array and format transactions
    // TODO: it just returns the transactions doesn't filter yet
    useEffect(() => {
        const filter = (currentFilter, dict) => {
            return dict;
        };
        const format = dict => {
            var formattedArray = [];
            for (var key in dict) {
                var total = dict[key].reduce((a, b) => ({
                    amount: a.amount + b.amount
                })).amount;
                formattedArray.push({ x: key, y: total });
            }
            return formattedArray;
        };
        if (Object.keys(categorizedTransactions).length != 0)
            setFormattedTransactions(
                format(filter(currentFilter, categorizedTransactions))
            );
    }, [currentFilter]);

    return (
        <Fragment>
            <AppMenuBar user={user} />
            <div className="flex-container">
                <PlaidLink user={user} setUser={setUser} />
                <DateFilter
                    currentFilter={currentFilter}
                    setCurrentFilter={setCurrentFilter}
                />
                <AccountFilter
                    accountList={user.accounts}
                    currentFilter={currentFilter}
                    setCurrentFilter={setCurrentFilter}
                />

                {formattedTransactions.length != 0 && (
                    <Chart data={formattedTransactions} />
                )}
            </div>
        </Fragment>
    );
}
