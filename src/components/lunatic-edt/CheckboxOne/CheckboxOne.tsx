import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { memo, useCallback } from "react";
import { CheckboxOption } from "../../../interface/lunatic-edt/CheckboxOptions";
import { makeStylesEdt } from "../../../theme";
import { important } from "../../../utils/lunatic-edt";
export type CheckboxOneProps = {
    handleChange(response: { [name: string]: string }, value: boolean): void;
    id?: string;
    label?: string;
    options: CheckboxOption[];
    value: { [key: string]: boolean };
    className?: string;
};

const CheckboxOne = memo((props: CheckboxOneProps) => {
    const { id, value, label, options, className, handleChange } = props;

    const { classes } = useStyles();

    const preSelectedValue: string | undefined = Object.keys(value).find(i => value[i] === true);
    const [currentOption, setCurrentOption] = React.useState<string | undefined>(preSelectedValue);

    const handleOptions = useCallback(
        (_event: React.MouseEvent<HTMLElement>, selectedOption: string) => {
            setCurrentOption(selectedOption);
            value[selectedOption] = !value[selectedOption];
            handleChange({ name: selectedOption }, value[selectedOption]);
        },
        [],
    );

    return (
        <ToggleButtonGroup
            orientation="vertical"
            value={currentOption}
            exclusive
            onChange={handleOptions}
            id={id}
            aria-label={label}
            className={className}
        >
            {options.map(option => (
                <ToggleButton
                    className={classes.MuiToggleButton}
                    key={option.id}
                    value={option.response.name}
                >
                    {option.label}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
});

const useStyles = makeStylesEdt({ "name": { CheckboxOne } })(theme => ({
    "MuiToggleButton": {
        marginBottom: "0.5rem",
        border: important("2px solid #FFFFFF"),
        borderRadius: important("6px"),
        backgroundColor: "#FFFFFF",
        color: theme.palette.primary.main,
        "&.Mui-selected": {
            borderColor: important(theme.palette.primary.main),
            fontWeight: "bold",
            backgroundColor: "#FFFFFF",
            color: theme.palette.primary.main,
        },
    },
}));

export default CheckboxOne;
