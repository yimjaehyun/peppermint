import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    }
}));

export default function AccountFilter(accountList) {
    const classes = useStyles();
    const [accountFilter, setAccountFilter] = React.useState("All");

    const handleChange = event => {
        setAccountFilter(event.target.value);
    };

    return (
        <div>
            {console.log(accountList)}
            <FormControl className={classes.formControl}>
                <InputLabel id="account-filter">Account</InputLabel>
                <Select
                    labelId="account-filter-label"
                    value={accountFilter}
                    onChange={handleChange}
                >
                    <MenuItem value="All">All</MenuItem>
                    {accountList.accountList.length > 0 &&
                        accountList.accountList.map(d =>
                            d.metadata.accounts.map(a => (
                                <MenuItem
                                    key={
                                        d.metadata.institution.name +
                                        " " +
                                        a.name
                                    }
                                    value={
                                        d.metadata.institution.name +
                                        " " +
                                        a.name
                                    }
                                >
                                    {d.metadata.institution.name + " " + a.name}
                                </MenuItem>
                            ))
                        )}
                </Select>
            </FormControl>
        </div>
    );
}
