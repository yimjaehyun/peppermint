import React from "react";
import DateFilter from "../components/dateFilter";
import PlaidLink from "../components/plaidLink";
import AppMenuBar from "../components/appBar";
import AccountFilter from "../components/accountFilter";
import { useEffect } from "react";

export default function Dashboard({ token }) {
    const [user, setUser] = React.useState({
        id: "",
        name: "",
        email: "",
        register_date: ""
    });

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
                console.log(data);
                setUser({
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    register_date: data.register_date
                });
            });
    }, []);

    return (
        <span>
            <AppMenuBar user={user} />
            <PlaidLink />
            <DateFilter />
            <AccountFilter
                accountList={
                    [
                        /*TODO post and get user transactions*/
                    ]
                }
            />
        </span>
    );
}
