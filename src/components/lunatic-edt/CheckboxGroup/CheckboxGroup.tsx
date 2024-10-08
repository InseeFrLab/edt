import { Checkbox, Paper, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import Icon from "../Icon";
import { CheckboxGroupSpecificProps } from "../../../interface/lunatic-edt";
import { CheckboxOption } from "../../../interface/lunatic-edt/CheckboxOptions";
import { makeStylesEdt } from "../../../theme";

export type CheckboxGroupProps = {
    handleChange(response: { [name: string]: string }, value: boolean): void;
    id?: string;
    options: CheckboxOption[];
    value: { [key: string]: boolean };
    componentSpecificProps?: CheckboxGroupSpecificProps;
};

const CheckboxGroup = memo((props: CheckboxGroupProps) => {
    const { id, value, options, handleChange, componentSpecificProps } = props;
    const { classes } = useStyles();

    const handleOptions = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        value[event.target.value] = !value[event.target.value];
        handleChange({ name: event.target.value }, value[event.target.value]);
    }, []);

    return (
        <div id={id}>
            {options.map(option => (
                <Paper className={classes.root} elevation={0} key={"paper-" + option.id}>
                    <div style={{ display: "flex" }}>
                        {componentSpecificProps &&
                            componentSpecificProps.optionsIcons &&
                            componentSpecificProps.optionsIcons[option.id].icon && (
                                <Icon
                                    className={classes.icon}
                                    icon={componentSpecificProps.optionsIcons[option.id].icon}
                                    alt={componentSpecificProps.optionsIcons[option.id].altIcon}
                                />
                            )}
                        <Typography color="textSecondary">{option.label}</Typography>
                    </div>

                    <Checkbox
                        key={option.id}
                        checked={value[option.response.name] ?? false}
                        value={option.response.name}
                        onChange={handleOptions}
                        className={classes.MuiCheckbox}
                    />
                </Paper>
            ))}
        </div>
    );
});

const useStyles = makeStylesEdt({ "name": { CheckboxGroup } })(theme => ({
    root: {
        maxWidth: "100%",
        margin: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "0.5rem",
    },
    MuiCheckbox: {
        color: theme.variables.neutral,
    },
    icon: {},
}));

export default CheckboxGroup;
