"use strict";

var util = require("util");

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const APP_PORT = process.env.PORT;
const mongoose = require("mongoose");

mongoose
    .connect(
        process.env.DB_CONNECTION,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => console.log("connected to DB!")
    )
    .catch(err => console.log(err));

var app = express();

app.use(express.json());
app.use(cors());

// Use Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/plaid", require("./routes/plaid"));

var server = app.listen(APP_PORT, function() {
    console.log("plaid-quickstart server listening on port " + APP_PORT);
});
