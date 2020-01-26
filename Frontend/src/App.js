import React, { Fragment } from "react";
import PlaidLink from "./components/plaidLink";
import Login from "./components/login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import createBrowserHistory from "history/createHashHistory";

function App() {
    let history = createBrowserHistory();

    const [token, setToken] = React.useState("");

    return (
        <Router>
            <div className="App">
                <Route path="/" render={() => <Login setToken={setToken} />} />
                {/*<Route path="/dashboard">{if token===""? <Redirect to="/" /> : <Dashboard/> } </Route>*/}
            </div>
        </Router>
    );
}

export default App;
