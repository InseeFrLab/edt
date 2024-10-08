import { Box, List, Typography } from "@mui/material";
import React, { ReactElement, memo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import HourChecker from "../../HourChecker";
import ProgressBar from "../../ProgressBar";
import TooltipInfo from "../../TooltipInfo";
import { INTERVAL, transformToIODataStructure } from "../WeeklyPlanner/utils";
import { DayDetailType, IODataStructure, WeeklyPlannerDataType } from "../../../../interface/lunatic-edt/WeeklyPlannerTypes";
import { TimeLineRowType } from "../../../../interface/lunatic-edt/DayOverviewTypes";
import { InfoProps, responsesHourChecker } from "../../../../interface/lunatic-edt/ComponentsSpecificProps";
import { responseType } from "../../../../interface/lunatic-edt/ActivityTypes";
import { LunaticMultiSelectionValues } from "../../../../interface/lunatic-edt/LunaticMultiSelectionValues";
import { convertTime, generateDateFromStringInput, generateStringInputFromDate, getArrayFromSession, setDateTimeToZero } from "../../../../utils/lunatic-edt/utils";
import { makeStylesEdt } from "../../../../theme/make-style-edt";

export type DayOverviewProps = {
    date: Date;
    isDisplayed: boolean;
    rawTimeLineData: TimeLineRowType[];
    activityData: WeeklyPlannerDataType[];
    setActivityData(data: WeeklyPlannerDataType[]): void;
    handleChangeData(value: any): void;
    infoLabels: InfoProps;
    datesLabel: string;
    workSumLabel: string;
    workedHoursSum: number;
    getFormatedWorkedSum: (workedHoursSum: number) => string;
    helpStep?: number;
    expandLessIcon: ReactElement<any>;
    expandMoreIcon: ReactElement<any>;
    expandLessWhiteIcon: ReactElement<any>;
    expandMoreWhiteIcon: ReactElement<any>;
    workIcon: ReactElement<any>;
    handleChange(response: responseType, value: IODataStructure[]): void;
    saveHours(idSurvey: string, response: responsesHourChecker): void;
    values: { [key: string]: string[] | IODataStructure[] | boolean[] };
    idSurvey: string;
    variables: Map<string, any>;
};

/**
 * Converts DayDetail array to values as LunaticMultiSelectionValues
 * @param details
 * @returns
 */
const fromDayDetailsToValues = (details: DayDetailType[]): LunaticMultiSelectionValues => {
    const values: LunaticMultiSelectionValues = {};

    details.forEach(b => {
        const time: Date = new Date();
        const splittedTime = b.start.split("h");
        time.setHours(Number(splittedTime[0]));
        time.setMinutes(Number(splittedTime[1]));

        for (let i = 0; i < b.duration / INTERVAL; i++) {
            const key = convertTime(time);
            values[key] = true;
            time.setMinutes(time.getMinutes() + INTERVAL);
        }
    });
    return values;
};

const renderHeader = (
    isDisplayed: boolean,
    classes: any,
    workSumLabel: string,
    workedHoursSum: number,
    getFormatedWorkedSum: (workedHoursSum: number) => string,
) => {
    return !isDisplayed ? (
        <ProgressBar
            className={classes.progressBar}
            value={Math.round((new Date().getHours() / 24) * 100)}
            isPrimaryMainColor={true}
        />
    ) : (
        <Box className={classes.textBox}>
            <Typography className={classes.workTimeText}>
                {workSumLabel}
                <span className={classes.bold}>{getFormatedWorkedSum(workedHoursSum)}</span>
            </Typography>
        </Box>
    );
};

/**
 * This component is the one shown inside WeeklyPlanner component when the user choose a day to fullfil.
 * It shows to the user a list of 24 Hourchecker components corresponding to an entire day.
 */
const DayOverview = memo((props: DayOverviewProps) => {
    const { classes, cx } = useStyles();
    const {
        date,
        isDisplayed,
        rawTimeLineData,
        activityData,
        setActivityData,
        handleChangeData,
        handleChange,
        infoLabels,
        datesLabel,
        workSumLabel,
        workedHoursSum,
        getFormatedWorkedSum,
        helpStep,
        expandLessIcon,
        expandMoreIcon,
        expandLessWhiteIcon,
        expandMoreWhiteIcon,
        workIcon,
        saveHours,
        idSurvey,
        variables,
    } = props;

    const [componentDisplay, setComponentDisplay] = React.useState<string>("none");
    const [timeLineData, setTimeLineData] = React.useState<TimeLineRowType[]>(rawTimeLineData);
    const [initStore, setInitStore] = React.useState<IODataStructure[]>([]);

    // Update timeLineData for HourCheckers from activityData
    useEffect(() => {
        const temp: TimeLineRowType[] = JSON.parse(JSON.stringify(rawTimeLineData));
        const dayBloc: WeeklyPlannerDataType | undefined = activityData.find(
            d => setDateTimeToZero(generateDateFromStringInput(d.date)).getTime() === date.getTime(),
        );
        let valuesDetail: LunaticMultiSelectionValues = {};

        if (dayBloc) {
            valuesDetail = fromDayDetailsToValues(dayBloc.detail);
        }

        Object.entries(valuesDetail).forEach(v => {
            const row: TimeLineRowType | undefined = temp.find((t: TimeLineRowType) => {
                return t.options.find(o => o.response.name === v[0]);
            });
            if (row) {
                row.value[v[0]] = v[1];
            }
        });
        setTimeLineData(temp);
        updatesValues(variables, date);
    }, [date]);

    useEffect(() => {
        if (activityData.length !== 0 && !isDisplayed) {
            updateValue();
        }
        isDisplayed ? setComponentDisplay("flex") : setComponentDisplay("none");
    }, [isDisplayed]);

    useEffect(() => {
        if (activityData.length !== 0 && !isDisplayed) {
            updateValue();
        }
        isDisplayed ? setComponentDisplay("flex") : setComponentDisplay("none");
    }, [location]);

    useEffect(() => {
        if (activityData.length !== 0 && !isDisplayed) {
            updateValue();
        }
        isDisplayed ? setComponentDisplay("flex") : setComponentDisplay("none");
    }, [idSurvey]);

    const updatesValues = (values: Map<string, any>, date: Date) => {
        let dates = values.get(datesLabel) as string[];
        if (dates == null || dates.length == undefined || dates.length < 7) {
            dates = getArrayFromSession(datesLabel);
        }
        const currentDateIndex = dates?.indexOf(generateStringInputFromDate(date));
        rawTimeLineData.forEach(timeLine => {
            timeLine.options.forEach(option => {
                const name = option.response.name;
                const valuesHour = values.get(option.response.name) as string[];
                const valueQuartier = valuesHour ? valuesHour[currentDateIndex] : "false";
                const valueIndex = valueQuartier === "true";
                timeLine.value[name] = valueIndex;
            });
        });
        setTimeLineData(rawTimeLineData);
    };

    /**
     * Callback triggered when a value is changed in one HourChecker
     * Updates the parent activityData state
     */
    const updateValue = () => {
        const temp: WeeklyPlannerDataType[] = [...activityData];
        let dayBloc: WeeklyPlannerDataType = temp.filter(
            d => setDateTimeToZero(generateDateFromStringInput(d.date)).getTime() === date.getTime(),
        )[0];
        let valuesList: LunaticMultiSelectionValues = {};

        // Create list of all LunaticMultiSelectionValues for this day
        timeLineData
            .map(t => t.value)
            .forEach(t => {
                Object.entries(t).forEach(([key, value]) => {
                    valuesList[key] = value;
                });
            });

        let details: DayDetailType[] = [];

        let startHour = "start";
        let endHour = "end";
        let durationTime = 0;

        Object.entries(valuesList).forEach(([key, value]) => {
            if (value && startHour === "start") {
                startHour = key;
                endHour = key;
                durationTime = durationTime + INTERVAL;
            } else if (value) {
                durationTime = durationTime + INTERVAL;
                endHour = key;
            }
            if (!value && endHour !== "end") {
                details.push({
                    start: startHour,
                    end: endHour,
                    duration: durationTime,
                });
                startHour = "start";
                endHour = "end";
                durationTime = 0;
            }
        });

        if (endHour !== "end") {
            details.push({
                start: startHour,
                end: endHour,
                duration: durationTime,
            });
        }

        if (dayBloc) dayBloc.detail = details;
        const toStore = transformToIODataStructure(temp);
        updatesValues(variables, date);
        handleChangeData(toStore);
        setActivityData(temp);
        setInitStore(toStore[0]);
    };

    const renderRow = (h: TimeLineRowType): any => {
        const helpPage =
            (helpStep == 2 && h.label == "3h00") ||
            (helpStep == 3 && h.label == "4h00") ||
            (helpStep == 4 && h.label == "5h00");
        let valueSelected: LunaticMultiSelectionValues = {};

        if (helpStep == 2) {
            valueSelected = {
                "3h15": true,
                "3h30": true,
                "3h45": true,
                "4h0": true,
            };
        } else if (helpStep == 4) {
            valueSelected = {
                "5h15": true,
                "5h30": true,
                "5h45": false,
                "6h0": false,
            };
        }
        return (
            <Box className={cx(classes.rowContainer, helpPage ? classes.helpRow : "")} key={uuidv4()}>
                <Box className={classes.rowLabel}>
                    <Typography className={classes.hourLabel}>{h.label}</Typography>
                </Box>

                <HourChecker
                    responses={h.options}
                    value={helpPage ? valueSelected : h.value}
                    helpStep={helpStep}
                    expandLessIcon={expandLessIcon}
                    expandMoreIcon={expandMoreIcon}
                    expandLessWhiteIcon={expandLessWhiteIcon}
                    expandMoreWhiteIcon={expandMoreWhiteIcon}
                    workIcon={workIcon}
                    store={initStore}
                    handleChangeData={handleChange}
                    saveHours={saveHours}
                    currentDate={generateStringInputFromDate(date)}
                    idSurvey={idSurvey}
                />
            </Box>
        );
    };
    return (
        <Box className={classes.mainContainer} display={componentDisplay} aria-label="dayoverview">
            <Box className={classes.headerContainerBox}>
                <Box className={classes.headerContainer}>
                    {renderHeader(
                        isDisplayed,
                        classes,
                        workSumLabel,
                        workedHoursSum,
                        getFormatedWorkedSum,
                    )}
                </Box>
                <TooltipInfo infoLabels={infoLabels} />
            </Box>

            <List className={classes.listContainer}>{timeLineData.map(l => renderRow(l))}</List>
        </Box>
    );
});

const useStyles = makeStylesEdt({ "name": { DayOverview } })(theme => ({
    mainContainer: {
        flexDirection: "column",
    },
    headerContainerBox: {
        zIndex: "1",
        position: "relative",
        width: "100vw !important",
        overflowX: "hidden",
        //Orchestrator content width is limited to 350px, 175px correspond to half of it
        transform: "translateX(calc(175px - 50vw))",
    },
    headerContainer: {
        backgroundColor: theme.variables.white,
        width: "100%",
        paddingBottom: "1rem",
    },
    dayLabel: {
        color: theme.palette.info.main,
        fontSize: "14px",
        padding: "1rem",
    },
    progressBar: {
        paddingLeft: "1rem",
        paddingRight: "1rem",
    },
    listContainer: {
        display: "flex",
        flexDirection: "column",
        paddingTop: "2rem",
        paddingBottom: "6rem",
    },
    rowContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "0.5rem",
    },
    rowLabel: {
        width: "50px",
    },
    hourLabel: {
        color: theme.palette.info.main,
        fontSize: "12px",
    },
    textBox: {
        paddingLeft: "1.5rem",
    },
    workTimeText: {
        fontSize: "14px",
    },
    bold: {
        fontWeight: "bold",
    },
    helpRow: {
        zIndex: "1400",
        pointerEvents: "none",
    },
}));

export default DayOverview;
