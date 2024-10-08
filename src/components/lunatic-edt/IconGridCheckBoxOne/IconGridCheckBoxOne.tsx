import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { memo, useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Alert from "../Alert";
import Icon from "../Icon/Icon";
import { CheckboxOneCustomOption } from "../../../interface/lunatic-edt/CheckboxOptions";
import { IconGridCheckBoxOneSpecificProps } from "../../../interface/lunatic-edt/ComponentsSpecificProps";
import { makeStylesEdt } from "../../../theme/make-style-edt";
import { createCustomizableLunaticField } from "../../../utils/lunatic-edt/create-customizable-lunatic-field";

type IconGridCheckBoxOneProps = {
    handleChange(response: { [name: string]: string }, value: string | undefined | number): void;
    componentSpecificProps: IconGridCheckBoxOneSpecificProps;
    response: { [name: string]: string };
    label: string;
    options: CheckboxOneCustomOption[];
    value: string;
    variables: Map<string, any>;
    bindingDependencies: string[];
};

const IconGridCheckBoxOne = memo((props: IconGridCheckBoxOneProps) => {
    let {
        handleChange,
        componentSpecificProps,
        response,
        label,
        options,
        value,
        variables,
        bindingDependencies,
    } = props;
    const {
        optionsIcons,
        backClickEvent,
        nextClickEvent,
        backClickCallback,
        nextClickCallback,
        labels,
        errorIcon,
        onSelectValue,
        modifiable = true,
    } = { ...componentSpecificProps };
    value = variables.get(bindingDependencies[0]);

    const [displayAlert, setDisplayAlert] = useState<boolean>(false);
    let selectedValue: string | number | undefined = value;
    const { classes, cx } = useStyles({ "modifiable": modifiable });

    useEffect(() => {
        if (backClickEvent && backClickCallback) {
            backClickCallback();
        }
    }, [backClickEvent]);

    useEffect(() => {
        if (nextClickEvent) {
            next(false, setDisplayAlert, nextClickCallback);
        }
    }, [nextClickEvent]);

    const next = (
        continueWithUncompleted: boolean,
        setDisplayAlert: (display: boolean) => void,
        nextClickCallback: () => void,
    ) => {
        if (!nextClickCallback) return;

        if ((selectedValue == null || selectedValue === "") && !continueWithUncompleted) {
            handleChange(response, undefined);
            setDisplayAlert(true);
        } else {
            nextClickCallback();
        }
    };

    const optionOnClick = (option: CheckboxOneCustomOption) => {
        const value =
            selectedValue !== undefined && option.value === selectedValue ? undefined : option.value;
        selectedValue = value;
        handleChange(response, value);
        if (onSelectValue && value != null) {
            onSelectValue();
        }
    };

    const handleAlert = useCallback(() => {
        next(true, setDisplayAlert, nextClickCallback);
    }, [displayAlert]);

    const onClick = useCallback((option: CheckboxOneCustomOption) => () => optionOnClick(option), []);

    const renderOption = (option: CheckboxOneCustomOption, index: number) => {
        return (
            <Box
                className={
                    selectedValue === option.value
                        ? cx(classes.option, classes.selectedOption)
                        : classes.option
                }
                key={uuidv4()}
                onClick={modifiable ? onClick(option) : undefined}
                tabIndex={index + 1}
                id={"icongridcheckboxone-" + index}
            >
                {optionsIcons && (
                    <Icon
                        className={classes.icon}
                        icon={optionsIcons[option.value].icon}
                        alt={optionsIcons[option.value].altIcon}
                    />
                )}
                <Typography className={classes.optionLabel}>{option.label}</Typography>
            </Box>
        );
    };

    return (
        <>
            {componentSpecificProps && labels && optionsIcons && (
                <>
                    <Alert
                        isAlertDisplayed={displayAlert}
                        onCompleteCallBack={() => setDisplayAlert(false)}
                        onCancelCallBack={handleAlert}
                        labels={{
                            content: labels.alertMessage,
                            cancel: labels.alertIgnore,
                            complete: labels.alertComplete,
                        }}
                        icon={errorIcon ?? <></>}
                    ></Alert>
                    <Box className={classes.root}>
                        <Typography className={classes.title}>{label}&nbsp;?</Typography>
                    </Box>

                    <Box className={classes.optionsBox}>
                        {options?.map((o, index) => {
                            return renderOption(o, index);
                        })}
                    </Box>
                </>
            )}
        </>
    );
});

const useStyles = makeStylesEdt<{ modifiable: boolean }>({ "name": { IconGridCheckBoxOne } })(
    (theme, { modifiable }) => ({
        root: {
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
        },
        title: {
            color: theme.palette.info.main,
            fontSize: "20px",
            textAlign: "center",
            marginTop: "2rem",
            marginBottom: "2rem",
        },
        optionsBox: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            cursor: "pointer",
        },
        option: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: theme.variables.white,
            width: "45.5%",
            marginTop: "4%",
            borderRadius: "15px",
            border: "2px solid transparent",
            color: !modifiable ? "rgba(0, 0, 0, 0.38)" : "",
            cursor: !modifiable ? "default" : "",
        },
        selectedOption: {
            borderColor: theme.palette.primary.main,
        },
        optionLabel: {
            fontSize: "14px",
            textAlign: "center",
            color: !modifiable ? "rgba(0, 0, 0, 0.38)" : theme.palette.text.secondary,
            fontWeight: "bold",
            marginTop: "1rem",
            marginRight: "0.5rem",
            marginBottom: "0.5rem",
            marginLeft: "0.5rem",
        },
        icon: {
            width: "80px",
            height: "45px",
            marginTop: "1rem",
        },
    }),
);

export default createCustomizableLunaticField(IconGridCheckBoxOne, "IconGridCheckBoxOne");
