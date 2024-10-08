import { Box, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";

import React, { memo, useCallback, useEffect } from "react";
import { TimepickerSpecificProps } from "../../../interface/lunatic-edt/ComponentsSpecificProps";
import { makeStylesEdt } from "../../../theme/make-style-edt";

export type DatepickerProps = {
    value?: string;
    onChange(value: string | null): void;
    label?: string;
    tipsLabel?: string;
    id?: string;
    min?: string;
    max?: string;
    componentSpecificProps?: TimepickerSpecificProps;
};

const Datepicker = memo((props: DatepickerProps) => {
    let { id, onChange, value, tipsLabel, componentSpecificProps } = props;
    const { classes } = useStyles();
    const [valueLocal, setValueLocal] = React.useState<Dayjs>(dayjs(value ?? dayjs()));

    useEffect(() => {
        onChange(valueLocal?.format("YYYY-MM-DD") || null);
    }, []);

    function setValueLunatic(newValue: Dayjs) {
        setValueLocal(newValue);
        onChange(newValue?.format("YYYY-MM-DD") || null);
    }

    return (
        <>
            {tipsLabel && (
                <Box className={classes.labelSpacer}>
                    <label>{tipsLabel}&nbsp;?</label>
                </Box>
            )}
            <LocalizationProvider
                adapterLocale={componentSpecificProps?.defaultLanguage}
                dateAdapter={AdapterDayjs}
            >
                <DatePicker
                    key={id}
                    disabled={!componentSpecificProps?.modifiable}
                    readOnly={!componentSpecificProps?.modifiable}
                    openTo="day"
                    views={["day"]}
                    value={valueLocal}
                    onChange={useCallback(newValue => {
                        setValueLunatic(newValue ? dayjs(newValue) : dayjs());
                    }, [])}
                    renderInput={useCallback(
                        params => (
                            <TextField
                                {...params}
                                sx={{
                                    "& legend": { display: "none" },
                                    "& fieldset": { top: 0 },
                                    "& label": { display: "none" },
                                }}
                            />
                        ),
                        [],
                    )}
                    componentsProps={{
                        actionBar: {
                            actions: ["accept"],
                        },
                    }}
                    className={classes.input}
                    showToolbar={false}
                />
            </LocalizationProvider>
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { Datepicker } })(() => ({
    input: {
        width: "100%",
        legend: {
            display: "none",
        },
    },
    labelSpacer: {
        marginBottom: "1rem",
    },
}));

export default Datepicker;
