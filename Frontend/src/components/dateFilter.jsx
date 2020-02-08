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

export default function DateFilter(props) {
    const classes = useStyles();
    const handleChange = event => {
        props.setCurrentFilter(prevState => ({
            ...prevState,
            date: event.target.value
        }));
    };

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel id="date-filter">Date</InputLabel>
                <Select
                    labelId="date-filter-label"
                    value={props.currentFilter.date}
                    onChange={handleChange}
                >
                    <MenuItem value="Day">Day</MenuItem>
                    <MenuItem value="Week">Week</MenuItem>
                    <MenuItem value="Month">Month</MenuItem>
                    <MenuItem value="Year">Year</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}
