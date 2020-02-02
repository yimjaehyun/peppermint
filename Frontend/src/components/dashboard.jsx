import React from "react";
import PlaidLink from "../components/plaidLink";
import DateFilter from "../components/dateFilter";
import AppMenuBar from "../components/appBar";
import AccountFilter from "../components/accountFilter";
import { useEffect } from "react";

export default function Dashboard({ token }) {
    const [user, setUser] = React.useState({
        id: "",
        name: "",
        email: "",
        register_date: "",
        accounts: []
    });

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

    return (
        <span>
            <AppMenuBar user={user} />
            <PlaidLink user={user} setUser={setUser} />
            <DateFilter />
            <AccountFilter accountList={user.accounts} />
        </span>
    );
}
