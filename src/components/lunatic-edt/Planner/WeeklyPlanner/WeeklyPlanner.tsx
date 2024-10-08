import { CircularProgress, List } from "@mui/material";
import { Box } from "@mui/system";
import { memo, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CheckboxGroupEdt from "../../CheckboxGroupEdt";
import TooltipInfo from "../../TooltipInfo";
import DayOverview from "../DayOverview/DayOverview";
import DayPlanner from "../DayPlanner/DayPlanner";
import {
    getProgressBarValue,
    transformToIODataStructure,
    transformToWeeklyPlannerDataType,
} from "./utils";
import { IODataStructure, WeeklyPlannerDataType } from "../../../../interface/lunatic-edt/WeeklyPlannerTypes";
import { responsesType, WeeklyPlannerSpecificProps } from "../../../../interface/lunatic-edt";
import { addArrayToSession, createCustomizableLunaticField, formateDateToFrenchFormat, generateDateFromStringInput, generateDayOverviewTimelineRawData, generateStringInputFromDate, getArrayFromSession, getFrenchDayFromDate, setDateTimeToZero } from "../../../../utils/lunatic-edt";
import { makeStylesEdt } from "../../../../theme";

export type WeeklyPlannerProps = {
    handleChange(
        response: { [name: string]: string },
        value: IODataStructure[] | string[] | boolean[],
    ): void;
    value: { [key: string]: string[] | IODataStructure[] | boolean[] };
    componentSpecificProps: WeeklyPlannerSpecificProps;
    bindingDependencies: string[];
    responses: [
        responsesType,
        responsesType,
        responsesType,
        responsesType,
        responsesType,
        responsesType,
    ];
    variables: Map<string, any>;
    placeWork: {
        bindingDependencies: string[];
        responses: [
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
        ];
        label: string;
    };
};

/**
 * Generates a week of date starting from the startDate
 * @param startDate
 * @returns
 */
const generateDayList = (startDate: Date): Date[] => {
    const dayList: Date[] = [startDate];
    for (let i = 1; i < 7; i++) {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + i);
        dayList.push(newDate);
    }
    return dayList;
};

/**
 * Returns total sum of work for the day formatted as h:mm
 * @returns
 */
const getFormatedWorkedSum = (workedHoursSum: number): string => {
    const tempDate = new Date();
    tempDate.setHours(0);
    tempDate.setMinutes(workedHoursSum);
    return (
        tempDate.getHours() +
        ":" +
        (tempDate.getMinutes() === 0 ? "00" : tempDate.getMinutes().toString())
    );
};

const setDataWeeklyPlannerArray = (
    variables: Map<string, any>,
    responses: [
        responsesType,
        responsesType,
        responsesType,
        responsesType,
        responsesType,
        responsesType,
    ],
) => {
    return variables.get(responses[0].response.name) as IODataStructure[];
};

const setDataArray = (
    variables: Map<string, any>,
    responses: [
        responsesType,
        responsesType,
        responsesType,
        responsesType,
        responsesType,
        responsesType,
    ],
    language: string,
) => {
    const dataWeeklyPlanner = setDataWeeklyPlannerArray(variables, responses);
    const data: WeeklyPlannerDataType[] | undefined =
        dataWeeklyPlanner?.length > 1
            ? transformToWeeklyPlannerDataType(dataWeeklyPlanner, language)
            : undefined;
    return data;
};

const WeeklyPlanner = memo((props: WeeklyPlannerProps) => {
    let { value, handleChange, componentSpecificProps, responses, variables, placeWork } = props;
    const {
        surveyDate,
        isSubChildDisplayed,
        setIsSubChildDisplayed,
        isPlaceWorkDisplayed,
        setIsPlaceWorkDisplayed,
        labels,
        saveAll,
        setDisplayedDayHeader,
        language,
        helpStep,
        moreIcon,
        expandLessIcon,
        expandMoreIcon,
        expandLessWhiteIcon,
        expandMoreWhiteIcon,
        workIcon,
        saveHours,
        idSurvey,
    } = {
        ...componentSpecificProps,
    };
    const { classes } = useStyles();

    const startDate: string = surveyDate ?? "";
    const startDateFormated: Date = setDateTimeToZero(generateDateFromStringInput(startDate));
    const dayList: Date[] = generateDayList(startDateFormated);

    const [store, setStore] = useState<[IODataStructure[], string[], string[], any[]]>([[], [], [], []]);
    const [dayOverviewSelectedDate, setDayOverviewSelectedDate] = useState<Date>(startDateFormated);
    const [activityData, setActivityData] = useState<WeeklyPlannerDataType[]>([]);
    const [needSpinner, setNeedSpinner] = useState<boolean>(true);
    const [dataCopy, setDataCopy] = useState<IODataStructure[]>([]);

    const setInit = () => {
        const dataUpdated = setDataArray(variables, responses, language);
        const temp: WeeklyPlannerDataType[] = dataUpdated ? [...dataUpdated] : [];
        dayList.forEach(date => {
            let dayBloc: WeeklyPlannerDataType | undefined = temp.find(
                d => setDateTimeToZero(generateDateFromStringInput(d.date)).getTime() === date.getTime(),
            );
            if (!dayBloc) {
                dayBloc = {
                    hasBeenStarted: false,
                    date: generateStringInputFromDate(date),
                    day: getFrenchDayFromDate(date),
                    detail: [],
                };
                temp.push(dayBloc);
            }
        });
        // loop through saved data to check if some are out of the week range after survey date update
        const dayListAsString: string[] = dayList.map(d => generateStringInputFromDate(d));
        const clearedTemp = temp
            .filter(dayBloc => dayListAsString.includes(dayBloc.date))
            .map(dayBlock => {
                return {
                    hasBeenStarted: dayBlock.hasBeenStarted,
                    date: getDateWithZeros(dayBlock.date),
                    day: dayBlock.day,
                    detail: dayBlock.detail,
                };
            })
            .sort((a, b) => a.date.localeCompare(b.date));
        setActivityData(clearedTemp);
        const toStore = transformToIODataStructure(clearedTemp);
        setStore(toStore);
        return toStore;
    };

    useEffect(() => {
        initializeStore();
    }, [idSurvey]);

    const initializeStore = () => {
        const storeAct = setInit();
        handleChange(responses[1].response, storeAct[1]);
        handleChange(responses[2].response, storeAct[2]);
        handleChange(responses[0].response, storeAct[0]);
        setStore(storeAct);
        return storeAct;
    };

    const getDateWithZeros = (date: string) => {
        const yearMonthDay = date.split("-");
        let day = yearMonthDay[2];
        day = Number(day) < 10 && !day.includes("0", 0) ? "0" + day : day;
        return yearMonthDay[0] + "-" + yearMonthDay[1] + "-" + day;
    };

    const formateDateLabel = (date: Date): string => {
        const formatedDate = formateDateToFrenchFormat(date, language);
        return formatedDate.toUpperCase();
    };

    useEffect(() => {
        setNeedSpinner(false);
    }, [isSubChildDisplayed]);

    useEffect(() => {
        setDisplayedDayHeader(formateDateLabel(dayOverviewSelectedDate));
    }, [dayOverviewSelectedDate]);

    // Complete activity data with default values for all days of the week if it was not the case in data input
    useEffect(() => {
        setInit();
        const init = initializeStore();
        addArrayToSession(labels.dates, init[1]);
        addArrayToSession(labels.datesStarted, init[2]);
        //saveAll(idSurvey, init);
    }, []);

    useEffect(() => {
        setNeedSpinner(true);
        //saveAll(idSurvey, store);
    }, [activityData]);

    const getMainDisplay = () => {
        return isSubChildDisplayed ? "none" : "inline";
    };

    const titleLabels = {
        normalTitle: labels.title,
    };

    const getWorkedHoursSum = () => {
        const dayBloc: WeeklyPlannerDataType = activityData.filter(
            d =>
                setDateTimeToZero(generateDateFromStringInput(d.date)).getTime() ===
                dayOverviewSelectedDate.getTime(),
        )[0];
        const sum: number = dayBloc?.detail.reduce((acc, val) => acc + val.duration, 0);
        return sum;
    };

    useEffect(() => {
        if (dataCopy.length > 0) {
            handleChange(responses[0].response, dataCopy);
            saveAll(idSurvey, [dataCopy, store[1], store[2], store[3]]);
        }
        if (store[1].length > 0) {
            handleChange(responses[1].response, store[1]);
            handleChange(responses[2].response, store[2]);
        }
    }, [dataCopy, idSurvey]);

    const renderHelp = () => {
        return (
            <DayOverview
                isDisplayed={true}
                date={dayOverviewSelectedDate}
                rawTimeLineData={generateDayOverviewTimelineRawData()}
                activityData={activityData}
                setActivityData={setActivityData}
                handleChangeData={handle}
                infoLabels={labels.infoLabels}
                datesLabel={labels.dates}
                workSumLabel={labels.workSumLabel}
                workedHoursSum={getWorkedHoursSum()}
                getFormatedWorkedSum={getFormatedWorkedSum}
                helpStep={helpStep}
                expandLessIcon={expandLessIcon}
                expandMoreIcon={expandMoreIcon}
                expandLessWhiteIcon={expandLessWhiteIcon}
                expandMoreWhiteIcon={expandMoreWhiteIcon}
                workIcon={workIcon}
                handleChange={handleChange}
                saveHours={saveHours}
                values={value}
                idSurvey={idSurvey}
                variables={variables}
            ></DayOverview>
        );
    };

    const handle = (data: [IODataStructure[], string[], string[], any[]]) => {
        if (data[0].length > 0) {
            setDataCopy(data[0]);
            handleChange(responses[0].response, dataCopy);
        }
        if (data[1].length > 0) {
            handleChange(responses[1].response, data[1]);
            handleChange(responses[2].response, data[2]);
        }
        let storeAct: [IODataStructure[], string[], string[], any[]] = [
            data[0],
            data[1].length > 0 ? data[1] : store[1],
            data[2].length > 0 ? data[2] : store[2],
            data[3].length > 0 ? data[3] : store[3],
        ];
        setStore(storeAct);
    };

    const getIndexOfDayPlanner = () => {
        let dates = variables.get(labels.dates) as string[];
        if (dates == null || dates.length < 7) {
            dates = getArrayFromSession(labels.dates);
        }
        const currentDate = generateStringInputFromDate(dayOverviewSelectedDate);
        const index = dates.findIndex(date => date == currentDate);
        const valuesForCheckbox: { [key: string]: boolean | boolean[] } = {};
        placeWork.responses.forEach(response => {
            const valueOfResponse = variables.get(response.response.name) as boolean[];
            valuesForCheckbox[response.response.name] = valueOfResponse;
        });
        return [valuesForCheckbox, index];
    };

    const handleChangeOptions = (
        response: { [name: string]: string },
        value: IODataStructure[] | string[] | boolean[],
    ) => {
        handleChange(response, value);
    };

    const renderOptions = () => {
        const values = getIndexOfDayPlanner();
        return (
            <CheckboxGroupEdt
                label={placeWork.label}
                handleChange={handleChangeOptions}
                responses={placeWork.responses}
                value={values[0]}
                variables={variables}
                bindingDependencies={placeWork.bindingDependencies}
                componentSpecificProps={componentSpecificProps}
                indexOfArray={values[1]}
            />
        );
    };

    const propsDayOverview = {
        isDisplayed: isSubChildDisplayed,
        date: dayOverviewSelectedDate,
        rawTimeLineData: generateDayOverviewTimelineRawData(),
        activityData: activityData,
        setActivityData: setActivityData,
        handleChangeData: handle,
        infoLabels: labels.infoLabels,
        datesLabel: labels.dates,
        workSumLabel: labels.workSumLabel,
        workedHoursSum: getWorkedHoursSum(),
        getFormatedWorkedSum: getFormatedWorkedSum,
        expandLessIcon: expandLessIcon,
        expandMoreIcon: expandMoreIcon,
        expandLessWhiteIcon: expandLessWhiteIcon,
        expandMoreWhiteIcon: expandMoreWhiteIcon,
        workIcon: workIcon,
        handleChange: handleChangeOptions,
        saveHours: saveHours,
        values: value,
        idSurvey: idSurvey,
        variables: variables,
    };

    const renderWeeklyPlanner = () => {
        return (
            <Box id="root-box">
                <DayOverview {...propsDayOverview}></DayOverview>
                {activityData.length !== 0 && needSpinner ? (
                    <>
                        <Box display={getMainDisplay()}>
                            <Box className={classes.containerRoot}>
                                <TooltipInfo
                                    infoLabels={labels.infoLabels}
                                    titleLabels={titleLabels}
                                    displayTooltip={getProgressBarValue(activityData) == 0}
                                />
                            </Box>

                            <List className={classes.listContainer}>
                                {dayList.map(d => (
                                    <DayPlanner
                                        date={d}
                                        key={uuidv4()}
                                        setDisplayDayOverview={setIsSubChildDisplayed}
                                        setDayOverviewSelectedDate={setDayOverviewSelectedDate}
                                        activityData={activityData}
                                        setActivityData={setActivityData}
                                        workSumLabel={labels.workSumLabel}
                                        presentButtonLabel={labels.presentButtonLabel}
                                        futureButtonLabel={labels.futureButtonLabel}
                                        editButtonLabel={labels.editButtonLabel}
                                        language={language}
                                        getFormatedWorkedSum={getFormatedWorkedSum}
                                        moreIcon={moreIcon}
                                        dataCopy={dataCopy}
                                        handleChange={handleChangeOptions}
                                        setIsPlaceWorkDisplayed={setIsPlaceWorkDisplayed}
                                        datesLabel={labels.dates}
                                        variables={variables}
                                        rawTimeLineData={generateDayOverviewTimelineRawData()}
                                    ></DayPlanner>
                                ))}
                            </List>
                        </Box>
                    </>
                ) : (
                    !isSubChildDisplayed && <CircularProgress />
                )}
            </Box>
        );
    };

    const renderWeek = () => {
        return isPlaceWorkDisplayed && isSubChildDisplayed ? renderOptions() : renderWeeklyPlanner();
    };

    return helpStep == null ? renderWeek() : renderHelp();
});

const useStyles = makeStylesEdt({ "name": { WeeklyPlanner } })(theme => ({
    containerRoot: {
        marginTop: "1rem",
    },
    listContainer: {
        display: "flex",
        flexDirection: "column",
        paddingBottom: "6rem",
        alignItems: "center",
    },
    progressBar: {
        padding: "1rem",
        backgroundColor: theme.variables.white,
        position: "relative",
        width: "100vw !important",
        overflowX: "hidden",
        //Orchestrator content width is limited to 350px, 175px correspond to half if it
        transform: "translateX(calc(175px - 50vw))",
        marginBottom: "1rem",
    },
}));

export default createCustomizableLunaticField(WeeklyPlanner, "WeeklyPlanner");
