import React, { Fragment } from "react";
import PlaidLink from "./components/plaidLink";
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import { createBrowserHistory } from "history";

function App() {
    let history = createBrowserHistory();

    const [token, setToken] = React.useState("");

    return (
        <Router>
            <div className="App">
                <Route
                    path="/"
                    exact={true}
                    render={() => <Login setToken={setToken} />}
                />
                <Route path="/dashboard">
                    {console.log(token)}
                    {token === "" ? (
                        <Redirect to="/" />
                    ) : (
                        <Dashboard token={token} />
                    )}
                </Route>
            </div>
        </Router>
    );
}

export default App;
