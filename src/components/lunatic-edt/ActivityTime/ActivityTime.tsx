import { Box } from "@mui/system";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { memo, useEffect } from "react";
import Timepicker from "../Timepicker/Timepicker";
import { Activity } from "../../../interface/lunatic-edt/TimepickerTypes";
import { TimepickerSpecificProps } from "../../../interface/lunatic-edt";
import { makeStylesEdt } from "../../../theme";
import { createCustomizableLunaticField } from "../../../utils/lunatic-edt";

export type ActivityTimeProps = {
    disabled?: boolean;
    readOnly?: boolean;
    value?: { START_TIME: any; END_TIME: any };
    handleChange(response: { [name: string]: string }, value: string | null): void;
    label?: string;
    startTimeLabel?: string;
    endTimeLabel?: string;
    id?: string;
    responses: { response: { [name: string]: string } }[];
    componentSpecificProps?: TimepickerSpecificProps;
    variables: Map<string, any>;
};

const ActivityTime = memo((props: ActivityTimeProps) => {
    const {
        id,
        responses,
        handleChange,
        readOnly,
        disabled,
        label,
        startTimeLabel,
        endTimeLabel,
        componentSpecificProps,
        variables,
    } = props;
    const { classes } = useStyles();

    const value = {
        START_TIME: variables.get("START_TIME"),
        END_TIME: variables.get("END_TIME"),
    };

    const computeStartTime = (
        activities: Activity[] | undefined,
        valueData: string | undefined,
        defaultValue: boolean | undefined,
    ) => {
        let time;
        if (valueData) {
            time = dayjs(valueData, componentSpecificProps?.constants.FORMAT_TIME);
        } else {
            if (defaultValue && activities && activities.length > 0) {
                time = dayjs(
                    activities[activities.length - 1]?.endTime,
                    componentSpecificProps?.constants.FORMAT_TIME,
                );
            } else {
                time = dayjs(
                    componentSpecificProps?.constants.START_TIME_DAY,
                    componentSpecificProps?.constants.FORMAT_TIME,
                );
            }
        }

        if (time.isValid() && time.minute() % 5 != 0) {
            const iterations = Math.trunc(time.minute() / 5) + 1;
            time = time.set(componentSpecificProps?.constants.MINUTE_LABEL, 0);
            time = time.add(iterations * 5, componentSpecificProps?.constants.MINUTE_LABEL);
        }
        return time;
    };
    const startTimeComputed = computeStartTime(
        componentSpecificProps?.activitiesAct,
        value?.START_TIME,
        componentSpecificProps?.defaultValue,
    );

    const [startTime] = React.useState<string | undefined>(
        startTimeComputed.format(componentSpecificProps?.constants.FORMAT_TIME),
    );
    const [endTime, setEndTime] = React.useState<string | undefined>(value?.END_TIME);

    useEffect(() => {
        dayjs.extend(customParseFormat);
        const startTimeComputed = computeStartTime(
            componentSpecificProps?.activitiesAct,
            value?.START_TIME,
            componentSpecificProps?.defaultValue,
        );
        if (endTime == null || startTime != value?.START_TIME) {
            let endTimeDay = startTimeComputed.add(5, componentSpecificProps?.constants.MINUTE_LABEL);
            setEndTime(endTimeDay.format(componentSpecificProps?.constants.FORMAT_TIME));
        }
    }, [value?.START_TIME]);

    return (
        <>
            {label && (
                <Box className={classes.labelSpacer}>
                    <label>{label}</label>
                </Box>
            )}
            <Timepicker
                response={responses[0].response}
                handleChange={handleChange}
                disabled={disabled}
                readOnly={readOnly}
                tipsLabel={startTimeLabel}
                id={id}
                value={startTime}
                componentSpecificProps={componentSpecificProps}
                minTime={startTimeComputed.format(componentSpecificProps?.constants.FORMAT_TIME)}
            />
            {componentSpecificProps?.helpStep != null && (
                <Box className={classes.imageHelpBox}>{componentSpecificProps?.helpImage}</Box>
            )}
            {componentSpecificProps?.helpStep == null && (
                <Timepicker
                    response={responses[1].response}
                    handleChange={handleChange}
                    disabled={disabled}
                    readOnly={readOnly}
                    tipsLabel={endTimeLabel}
                    id={id}
                    value={endTime}
                    componentSpecificProps={componentSpecificProps}
                />
            )}
        </>
    );
});

const useStyles = makeStylesEdt({ "name": { ActivityTime } })(theme => ({
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
    labelSpacer: {
        marginBottom: "1rem",
    },
    tipsLabel: {
        fontSize: "14px",
        color: theme.palette.info.main,
        fontWeight: "bold",
    },
    imageHelpBox: {
        svg: {
            zIndex: "4000",
            position: "relative",
            marginTop: "-3rem",
            width: "85%",
            marginLeft: "1.75rem",
        },
    },
}));

export default createCustomizableLunaticField(ActivityTime, "ActivityTime");
