import { Box, InputLabel, MenuItem, Select } from "@mui/material";
import "dayjs/locale/fr";
import React, { memo, useEffect } from "react";
import { TimepickerSpecificProps } from "../../../interface/lunatic-edt";
import { makeStylesEdt } from "../../../theme";
import { createCustomizableLunaticField } from "../../../utils/lunatic-edt";
export type DurationProps = {
    value?: string;
    handleChange(response: { [name: string]: string }, value: string | undefined): void;
    label?: string;
    hourLabel?: string;
    andLabel?: string;
    minLabel?: string;
    response: { [name: string]: string };
    componentSpecificProps?: TimepickerSpecificProps;
    variables: Map<string, any>;
    bindingDependencies: string[];
};

const enum DurationEnum {
    HOUR = "h",
    MINUTES = "m",
}

const getNumElements = (typeDuration: string) => {
    if (DurationEnum.HOUR == typeDuration) {
        return 24;
    } else if (DurationEnum.MINUTES == typeDuration) {
        return 60;
    } else {
        return 0;
    }
};

const Duration = memo((props: DurationProps) => {
    let {
        handleChange,
        value,
        label,
        hourLabel,
        andLabel,
        minLabel,
        response,
        componentSpecificProps,
        variables,
        bindingDependencies,
    } = props;

    value = variables.get(bindingDependencies[0]);

    const { classes } = useStyles();
    const [hour, setHour] = React.useState("");
    const [minutes, setMinutes] = React.useState("");

    useEffect(() => {
        if (value != null) {
            setHour(value.split(":")[0]);
            setMinutes(value.split(":")[1]);
        }
    }, []);

    useEffect(() => {
        const hours = isNaN(Number(hour)) || hour == null || hour.length == 0 ? undefined : hour;
        const min =
            isNaN(Number(minutes)) || minutes == null || minutes.length == 0 ? undefined : minutes;

        if (hours == null && min == null) {
            handleChange(response, undefined);
        } else {
            const newValue = (hours ?? "0") + ":" + (min ?? "0");
            handleChange(response, newValue);
        }
    }, [hour, minutes]);

    function setValueLunatic(newHour: string, newMin: string) {
        const hours = isNaN(Number(newHour)) || newHour == null ? "0" : newHour;
        setHour(hours);

        const minutes = isNaN(Number(newMin)) || newMin == null ? "0" : newMin;
        setMinutes(minutes);

        const newValue = hours + ":" + minutes;
        handleChange(response, newValue);
    }

    const listHourElements: number[] = Array.from(Array(getNumElements("h")).keys());
    const listMinElements: number[] = Array.from(Array(getNumElements("m")).keys());

    return (
        <>
            <Box className={classes.labelSpacer}>
                <h1 className={classes.h1}>{label}&nbsp;?</h1>
            </Box>
            <Box className={classes.containerBox}>
                <Box className={classes.durationBox}>
                    <Box className={classes.durationInnerBox}>
                        {hourLabel && (
                            <InputLabel id={"durationHour-label"} className={classes.innerLabel}>
                                {hourLabel}
                            </InputLabel>
                        )}
                        <Select
                            className={classes.selectBox}
                            labelId={"durationHour-label"}
                            id={"durationHour-select"}
                            value={hour}
                            onChange={newValue => setValueLunatic(newValue.target.value, minutes)}
                            MenuProps={{
                                PopoverClasses: {
                                    root: classes.menuSelectBox,
                                },
                            }}
                            disabled={!componentSpecificProps?.modifiable}
                            inputProps={{
                                "aria-label": "durationHour-label",
                                "aria-labelledby": "durationHour-label",
                            }}
                        >
                            {listHourElements?.map(option => {
                                return (
                                    <MenuItem
                                        key={"durationHour-" + option}
                                        value={option}
                                        id={"hour-" + option}
                                    >
                                        {option}h
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </Box>
                    <Box className={classes.innerLabel}>
                        <InputLabel id={"durationAnd-label"} className={classes.innerLabel}>
                            {andLabel}
                        </InputLabel>
                    </Box>
                    <Box className={classes.durationInnerBox}>
                        {minLabel && (
                            <InputLabel id={"durationMin-label"} className={classes.innerLabel}>
                                {minLabel}
                            </InputLabel>
                        )}
                        <Select
                            className={classes.selectBox}
                            labelId={"durationMin-label"}
                            id={"durationMin-select"}
                            value={minutes}
                            onChange={newValue => setValueLunatic(hour, newValue.target.value)}
                            MenuProps={{
                                PopoverClasses: {
                                    root: classes.menuSelectBox,
                                },
                            }}
                            disabled={!componentSpecificProps?.modifiable}
                            inputProps={{
                                "aria-label": "",
                                "aria-labelledby": "durationHour-label",
                            }}
                        >
                            {listMinElements?.map(option => {
                                return (
                                    <MenuItem
                                        key={"durationMin-" + option}
                                        value={option}
                                        id={"min-" + option}
                                    >
                                        {option}mn
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </Box>
                </Box>
            </Box>
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { Duration } })(theme => ({
    labelSpacer: {
        marginBottom: "1rem",
        textAlign: "center",
    },
    innerLabel: {
        fontSize: "14px !important",
        color: theme.palette.info.main,
        fontWeight: "bold",
        display: "flex",
        justifyContent: "center",
    },
    containerBox: {
        backgroundColor: theme.variables.white,
        padding: "2rem 3rem",
        display: "flex",
        justifyContent: "center",
        borderRadius: "10px",
    },
    durationBox: {
        display: "flex",
        justifyContent: "space-between",
        width: "85%",
    },
    durationInnerBox: {
        width: "46%",
    },
    selectBox: {
        width: "100%",
        ".MuiOutlinedInput-input": {
            minHeight: "1rem !important",
            height: "1rem !important",
        },
    },
    menuSelectBox: {
        height: "45%",
    },
    h1: {
        fontSize: "18px",
        margin: 0,
        lineHeight: "1.5rem",
        fontWeight: "bold",
    },
}));

export default createCustomizableLunaticField(Duration, "Duration");
