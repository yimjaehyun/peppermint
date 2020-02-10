import React, { Fragment } from "react";
import { useEffect } from "react";
import PlaidLink from "../components/plaidLink";
import DateFilter from "../components/dateFilter";
import AppMenuBar from "../components/appBar";
import AccountFilter from "../components/accountFilter";
import Chart from "../components/charts";
import ReactVirtualizedTable from "../components/transactionTable";
import * as moment from "moment";
import "../css/dashboard.css";

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
        account: { id: null, name: "All" }
    });

    // transactions -> filteredTransactions -> categorizedTransactions -> chartFormattedTransactions
    // Array of plaid transaction objects
    const [transactions, setTransactions] = React.useState([]);
    const [filteredTransactions, setFilteredTransactions] = React.useState([]);
    // a dictionary of key: category name and value: [transactions]
    const [
        categorizedTransactions,
        setCategorizedTransactions
    ] = React.useState({});
    const [
        chartFormattedTransactions,
        setChartFormattedTransactions
    ] = React.useState([]);
    const [
        tableFormattedTransactions,
        setTableFormattedTransactions
    ] = React.useState([]);

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

    // Fetch plaid transactions api and load transactions state
    useEffect(() => {
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
                        setTransactions(prevState =>
                            prevState.concat(data.transactions.transactions)
                        );
                    });
            });
        }
    }, [user.accounts]);

    // set filteredTransacitons state from transactions
    useEffect(() => {
        // Filter date
        var filteredDateTransacitons = transactions.filter(t =>
            moment(t.date).isSame(
                moment.now(),
                currentFilter.date.toLowerCase()
            )
        );

        // Filter account id
        if (currentFilter.account.name != "All") {
            setFilteredTransactions(
                filteredDateTransacitons.filter(
                    t => t.account_id == currentFilter.account.id
                )
            );
        } else {
            setFilteredTransactions(filteredDateTransacitons);
        }
    }, [transactions, currentFilter]);

    // set categorizedTransactions state from filteredTransactions
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

        setCategorizedTransactions(sortByCategory(filteredTransactions));
    }, [filteredTransactions]);

    // format transactions and set both FormattedTransactions
    useEffect(() => {
        const formatChart = dict => {
            var formattedArray = [];
            for (var key in dict) {
                var total = dict[key].reduce((a, b) => ({
                    amount: a.amount + b.amount
                })).amount;
                formattedArray.push({ x: key, y: total });
            }
            return formattedArray;
        };

        const formatTable = arr => {
            var formattedArray = [];
            for (var i = 0; i < arr.length; i++) {
                var transactionObj = arr[i];
                formattedArray.push({
                    id: i,
                    transaction: transactionObj.name,
                    amount: transactionObj.amount,
                    category: transactionObj.category[0],
                    date: transactionObj.date
                });
            }
            return formattedArray;
        };
        setChartFormattedTransactions(formatChart(categorizedTransactions));
        setTableFormattedTransactions(formatTable(filteredTransactions));
    }, [categorizedTransactions]);

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
                {chartFormattedTransactions.length != 0 ? (
                    <Chart data={chartFormattedTransactions} />
                ) : (
                    <p>No transactions :( </p>
                )}

                <ReactVirtualizedTable data={tableFormattedTransactions} />
            </div>
        </Fragment>
    );
}
