import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useHistory } from "react-router-dom";

export default function Login({ setToken }) {
    const [open, setOpen] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState({
        isError: false,
        msg: ""
    });
    let history = useHistory();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);

        // To reset error on Cancel
        setError({ isError: false, msg: "" });

        // Reset password and email
        setEmail("");
        setPassword("");
        setName("");
    };

    const handleSubmit = () => {
        fetch("/api/users/register/", {
            method: "post",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        })
            .then(function(res) {
                return res.json();
            })
            .then(function(data) {
                console.log(data);
                if (data.msg) {
                    setError({ isError: true, msg: data.msg });
                } else {
                    setError({ isError: false, msg: "" });
                    //calls setToken from parent
                    setToken(data.token);
                    // Redirect to protected dashboard page
                    history.push("/dashboard");
                }
            });
    };

    return (
        <div>
            <Button
                variant="outlined"
                color="primary"
                onClick={handleClickOpen}
            >
                Sign Up
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="login-form-dialog-title"
            >
                <DialogTitle id="login-form-dialog-title">Sign Up</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="name"
                        fullWidth
                        onChange={e => setName(e.target.value)}
                        error={error.isError}
                        helperText={error.isError ? error.msg : ""}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        onChange={e => setEmail(e.target.value)}
                        error={error.isError}
                        helperText={error.isError ? error.msg : ""}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        onChange={e => setPassword(e.target.value)}
                        error={error.isError}
                        helperText={error.isError ? error.msg : ""}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
