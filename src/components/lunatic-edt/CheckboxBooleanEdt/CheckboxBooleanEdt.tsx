import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { memo, useCallback, useEffect, useState } from "react";
import Alert from "../Alert";
import { CheckboxBooleanEdtSpecificProps } from "../../../interface/lunatic-edt";
import { makeStylesEdt } from "../../../theme";
import { important, createCustomizableLunaticField } from "../../../utils/lunatic-edt";

export type CheckboxBooleanEdtProps = {
    id?: string;
    label?: string;
    checked?: boolean;
    value?: any;
    disabled?: boolean;
    className?: string;
    handleChange(response: { [name: string]: string }, value: any): void;
    response: { [name: string]: string };
    componentSpecificProps: CheckboxBooleanEdtSpecificProps;
    bindingDependencies: string[];
    variables: Map<string, any>;
};

const CheckboxBooleanEdt = memo((props: CheckboxBooleanEdtProps) => {
    let {
        id,
        label,
        disabled,
        value,
        className,
        handleChange,
        response,
        componentSpecificProps,
        bindingDependencies,
        variables,
    } = props;
    const { classes, cx } = useStyles();

    let {
        backClickEvent,
        nextClickEvent,
        backClickCallback,
        nextClickCallback,
        labels,
        errorIcon,
        onSelectValue,
        modifiable = true,
    } = {
        ...componentSpecificProps,
    };

    value = variables.get(bindingDependencies[0]);

    const [localValue, setLocalValue] = React.useState(value);
    const [displayAlert, setDisplayAlert] = useState<boolean>(false);

    useEffect(() => {
        if (backClickEvent && backClickCallback) {
            backClickCallback();
        }
    }, [backClickEvent]);

    useEffect(() => {
        if (nextClickEvent && nextClickCallback) {
            next(false, setDisplayAlert, nextClickCallback);
        }
    }, [nextClickEvent]);

    const handleOptions = useCallback((_event: React.MouseEvent<HTMLElement>, value: any) => {
        setLocalValue(value);

        if (value != null) {
            handleChange(response, value);
        }
    }, []);

    useEffect(() => {
        if (localValue != value && localValue != null) {
            if (nextClickCallback) {
                next(true, setDisplayAlert, nextClickCallback);
            } else {
                if (onSelectValue) onSelectValue();
            }
        }
    }, [localValue]);

    const next = (
        continueWithUncompleted: boolean,
        setDisplayAlert: (display: boolean) => void,
        nextClickCallback: () => void,
    ) => {
        if (localValue == null && !continueWithUncompleted) {
            setDisplayAlert(true);
        } else {
            nextClickCallback();
        }
    };

    const handleAlert = useCallback(() => {
        if (nextClickCallback) next(true, setDisplayAlert, nextClickCallback);
    }, [displayAlert]);

    return (
        <>
            {labels && (
                <Alert
                    isAlertDisplayed={displayAlert}
                    onCompleteCallBack={() => setDisplayAlert(false)}
                    onCancelCallBack={handleAlert}
                    labels={{
                        content: labels.alertMessage || "",
                        cancel: labels.alertIgnore || "",
                        complete: labels.alertComplete || "",
                    }}
                    icon={errorIcon ?? <></>}
                ></Alert>
            )}
            <Box>
                <Box className={classes.labelSpacer}>
                    <h1 className={classes.h1}>{label}&nbsp;?</h1>
                </Box>
                <ToggleButtonGroup
                    orientation="horizontal"
                    value={localValue}
                    exclusive
                    onChange={handleOptions}
                    id={id}
                    aria-label={label}
                    className={cx(classes.buttonGroupBox, className)}
                    disabled={modifiable ? disabled : true}
                >
                    <ToggleButton
                        className={classes.MuiToggleButton}
                        value={"false"}
                        aria-label="no"
                        id="false-button"
                    >
                        Non
                    </ToggleButton>
                    <ToggleButton
                        className={cx(classes.MuiToggleButton, classes.separator)}
                        value={"true"}
                        aria-label="yes"
                        id="true-button"
                    >
                        Oui
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { CheckboxBooleanEdt } })(theme => ({
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
    labelSpacer: {
        margin: "1rem 0rem",
        textAlign: "center",
    },
    buttonGroupBox: {
        "width": "100% !important",
        "justifyContent": "center",
    },
    h1: {
        fontSize: "18px",
        margin: 0,
        lineHeight: "1.5rem",
        fontWeight: "bold",
    },
}));

export default createCustomizableLunaticField(CheckboxBooleanEdt, "CheckboxBooleanEdt");
