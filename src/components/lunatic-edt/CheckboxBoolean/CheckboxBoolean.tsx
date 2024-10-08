import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { memo, useCallback } from "react";
import { important } from "../../../utils/lunatic-edt";
import { makeStylesEdt } from "../../../theme";
export type CheckboxBooleanProps = {
    onClick(value: boolean): void;
    id?: string;
    label?: string;
    checked?: boolean;
    disabled?: boolean;
    className?: string;
};

const CheckboxBoolean = memo((props: CheckboxBooleanProps) => {
    const { onClick, id, label, checked, disabled, className } = props;
    const { classes, cx } = useStyles();
    const valAsString = checked === null ? "" : checked + "";
    const [localValue, setLocalValue] = React.useState(valAsString);

    const handleOptions = useCallback((_event: React.MouseEvent<HTMLElement>, value: string) => {
        setLocalValue(value);
        const valAsBool = value === "true" ? true : false;
        onClick(valAsBool);
    }, []);

    return (
        <ToggleButtonGroup
            orientation="horizontal"
            value={localValue}
            exclusive
            onChange={handleOptions}
            id={id}
            aria-label={label}
            className={className}
            disabled={disabled}
        >
            <ToggleButton className={classes.MuiToggleButton} value="false" aria-label="no">
                Non
            </ToggleButton>
            <ToggleButton
                className={cx(classes.MuiToggleButton, classes.separator)}
                value="true"
                aria-label="yes"
            >
                Oui
            </ToggleButton>
        </ToggleButtonGroup>
    );
});

const useStyles = makeStylesEdt({ "name": { CheckboxBoolean } })(theme => ({
    "MuiToggleButton": {
        border: important("2px solid white"),
        borderRadius: important("6px"),
        padding: "0.5rem 3rem",
        backgroundColor: "white",
        color: theme.palette.primary.main,
        "&.Mui-selected": {
            borderColor: important(theme.palette.primary.main),
            fontWeight: "bold",
            backgroundColor: "white",
            color: theme.palette.primary.main,
        },
    },
    "separator": {
        marginLeft: important("1rem"),
    },
}));

export default CheckboxBoolean;
