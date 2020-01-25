const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

require("dotenv").config();

// User Model
const User = require("../models/user");

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }

    // Check for existing user
    User.findOne({ email }).then(user => {
        if (!user) res.status(400).json({ msg: "User does not exists" });

        // Validate password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch)
                return res.status(400).json({ msg: "Invalid credentials" });

            jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token,
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }
                    });
                }
            );
        });
    });
});

module.exports = router;
