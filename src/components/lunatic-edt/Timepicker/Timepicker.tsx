import React, { memo, useCallback, useEffect } from "react";
import { Button, DialogActions, InputAdornment, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickersActionBarProps } from "@mui/x-date-pickers/PickersActionBar";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";
import { TimepickerSpecificProps } from "../../../interface/lunatic-edt";
import { makeStylesEdt } from "../../../theme";
import { createCustomizableLunaticField } from "../../../utils/lunatic-edt";


export type TimepickerProps = {
    value?: string;
    handleChange(response: { [name: string]: string }, value: string | null): void;
    label?: string;
    tipsLabel?: string;
    id?: string;
    response: { [name: string]: string };
    componentSpecificProps?: TimepickerSpecificProps;
    minTime?: string;
};

const Timepicker = memo((props: TimepickerProps) => {
    const { id, response, handleChange, value, label, tipsLabel, componentSpecificProps, minTime } =
        props;
    const { classes, cx } = useStyles();

    const [valueLocal, setValue] = React.useState<Dayjs | undefined>();

    useEffect(() => {
        setValue(dayjs(value, componentSpecificProps?.constants.FORMAT_TIME));
    }, [value]);

    useEffect(() => {
        if (valueLocal != undefined && valueLocal?.isValid())
            handleChange(
                response,
                valueLocal?.format(componentSpecificProps?.constants.FORMAT_TIME) || null,
            );
    }, [valueLocal]);

    /**
     * Round min to next/previous interval of 5
     * @param min
     * @returns
     */
    const round5 = (min: number) => {
        const minRestTo5 = min % 5;
        if (minRestTo5 > 0) {
            return min - minRestTo5 + 5;
        } else return min;
    };

    function setValueLunatic(newValue: Dayjs | null) {
        if (newValue != undefined && newValue?.isValid()) {
            const min = newValue.minute();
            const newValueRound5 = newValue.set("minutes", round5(min));
            setValue(newValueRound5);
            handleChange(
                response,
                newValue?.format(componentSpecificProps?.constants.FORMAT_TIME) || null,
            );
        }
    }

    const MyActionBar = ({ onAccept, onCancel }: PickersActionBarProps) => {
        return (
            <DialogActions>
                <Button onClick={onCancel}> {componentSpecificProps?.labels.cancelLabel} </Button>
                <Button onClick={onAccept}> {componentSpecificProps?.labels.validateLabel} </Button>
            </DialogActions>
        );
    };

    const onChange = useCallback((newValue: string | null) => {
        if (newValue == null) return;
        const newValueDayjs = dayjs(newValue, componentSpecificProps?.constants.FORMAT_TIME);
        setValueLunatic(newValueDayjs);
    }, []);

    return (
        <>
            {label && (
                <Box className={classes.labelSpacer}>
                    <h1 className={classes.h1}>{label}</h1>
                </Box>
            )}
            <Box className={cx(classes.root, componentSpecificProps?.helpStep ? classes.helpBox : "")}>
                <Box className={classes.tipsLabel}>
                    <p>{tipsLabel}</p>
                </Box>
                <LocalizationProvider adapterLocale={"fr"} dateAdapter={AdapterDayjs}>
                    <TimePicker
                        key={id}
                        disabled={!componentSpecificProps?.modifiable}
                        readOnly={!componentSpecificProps?.modifiable}
                        openTo="hours"
                        views={["hours", "minutes"]}
                        value={valueLocal}
                        onChange={newValue => onChange(newValue)}
                        renderInput={useCallback(
                            params => (
                                <TextField
                                    size="small"
                                    {...params}
                                    sx={{
                                        svg: { color: "#1F4076" },
                                        "& legend": { display: "none" },
                                        "& fieldset": { top: 0 },
                                        "& label": { display: "grid", visibility: "hidden" },
                                    }}
                                />
                            ),
                            [],
                        )}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {componentSpecificProps?.arrowDownIcon}
                                </InputAdornment>
                            ),
                            "aria-label": componentSpecificProps?.labels.ariaLabelTimepicker,
                        }}
                        className={classes.input}
                        minutesStep={5}
                        label={label ?? tipsLabel}
                        components={{
                            ActionBar: MyActionBar,
                        }}
                        minTime={minTime ? minTime : undefined}
                    />
                </LocalizationProvider>
            </Box>
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { Timepicker } })(theme => ({
    input: {
        width: "55%",
    },
    root: {
        padding: "1rem 2rem 2rem 2rem",
        backgroundColor: theme.variables.white,
        border: "1px solid transparent",
        borderRadius: "10px",
        margin: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    helpBox: {
        position: "relative",
        zIndex: "1400",
    },
    labelSpacer: {
        marginBottom: "1rem",
    },
    tipsLabel: {
        fontSize: "14px",
        color: theme.palette.info.main,
        fontWeight: "bold",
    },
    h1: {
        fontSize: "18px",
        margin: 0,
        lineHeight: "1.5rem",
        fontWeight: "bold",
    },
}));

export default createCustomizableLunaticField(Timepicker, "Timepicker");
