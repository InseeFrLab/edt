import { TextField } from "@mui/material";
import { memo, useCallback } from "react";
import { makeStylesEdt } from "../../../theme";

export type InputProps = {
    id?: string;
    value?: string;
    variables?: Map<string, any>;
    bindingDependencies: string[];
    disabled?: boolean;
    label?: string;
    labelledBy?: string;
    placeholder?: string;
    onChange(value: string): void;
    mandatory?: boolean;
    maxLength?: number;
    errors?: { errorMessage: string };
};

export const Input = memo((props: InputProps) => {
    const {
        id,
        value,
        variables,
        bindingDependencies,
        disabled,
        labelledBy,
        placeholder,
        mandatory,
        errors,
        maxLength,
        onChange,
    } = props;
    const { classes } = useStyles();
    const localValue = value ?? variables?.get(bindingDependencies[0]);
    return (
        <TextField
            id={id}
            labelled-by={labelledBy}
            disabled={disabled}
            placeholder={placeholder}
            required={mandatory}
            value={localValue ?? ""}
            error={errors ? true : false}
            helperText={errors?.errorMessage}
            inputProps={{ maxLength: maxLength ?? 100 }}
            onChange={useCallback(
                (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                    onChange(event.target.value),
                [],
            )}
            size="small"
            variant="outlined"
            className={classes.input}
            aria-label="input"
        />
    );
});

const useStyles = makeStylesEdt({ "name": { Input } })(() => ({
    input: {
        width: "100%",
    },
}));

export default Input;
