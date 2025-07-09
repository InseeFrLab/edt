import { Alert, makeStylesEdt, TimepickerSpecificProps } from "@inseefrlab/lunatic-edt";
import { IconButton, Snackbar } from "@mui/material";
import ErrorIcon from "../../../../assets/illustration/error/activity.svg?react";
import CloseIcon from "../../../../assets/illustration/mui-icon/close.svg?react";
import ArrowDownIcon from "../../../../assets/illustration/mui-icon/expand-more.svg?react";
import FlexCenter from "../../../../components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "../../../../components/commons/LoopSurveyPage/LoopSurveyPage";
import { DAY_LABEL, FORMAT_TIME, MINUTE_LABEL, START_TIME_DAY } from "../../../../constants/constants";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { EdtRoutesNameEnum } from "../../../../enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "../../../../enumerations/FieldNameEnum";
import { LoopEnum } from "../../../../enumerations/LoopEnum";
import { OrchestratorContext } from "../../../../interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "../../../../orchestrator/Orchestrator";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { getLabelsWhenQuit } from "../../../../service/alert-service";
import { getLoopInitialPage } from "../../../../service/loop-service";
import {
    getLoopPageSubpage,
    getNextLoopPage,
    getStepData,
} from "../../../../service/loop-stepper-service";
import {
    getLoopParameterizedNavigatePath,
    navToActivityRoutePlanner,
    navToActivitySummary,
    setEnviro,
} from "../../../../service/navigation-service";
import { isDesktop } from "../../../../service/responsive";
import { getActivitiesOrRoutes, surveyReadOnly } from "../../../../service/survey-activity-service";
import { getData, getValue, getValueOfData, saveData } from "../../../../service/survey-service";
import { getSurveyIdFromUrl } from "../../../../utils/utils";

const today: Dayjs = dayjs();

const ActivityDurationPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    const { classes } = useStyles();
    setEnviro(context, useNavigate(), callbackHolder);

    const location = useLocation();
    const idSurvey = getSurveyIdFromUrl(context, location);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;
    const isRoute = getValue(idSurvey, FieldNameEnum.ISROUTE, currentIteration) as boolean;
    const currentPage = EdtRoutesNameEnum.ACTIVITY_DURATION;
    const stepData = getStepData(currentPage, isRoute);

    const activitiesAct = getActivitiesOrRoutes(t, idSurvey, context.source).activitiesRoutesOrGaps;

    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);
    const [snackbarText, setSnackbarText] = useState<string | undefined>(undefined);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [lastEndTime, setLastEndTime] = useState(dayjs());

    const specificProps: TimepickerSpecificProps = {
        activitiesAct: activitiesAct,
        defaultValue: true,
        constants: {
            START_TIME_DAY: START_TIME_DAY,
            FORMAT_TIME: FORMAT_TIME,
            MINUTE_LABEL: MINUTE_LABEL,
        },
        arrowDownIcon: <ArrowDownIcon aria-label={t("accessibility.asset.mui-icon.expand-more")} />,
        modifiable: !surveyReadOnly(context.rightsSurvey),
        defaultLanguage: "fr",
        labels: {
            ariaLabelTimepicker: t("accessibility.asset.timepicker-alt"),
            cancelLabel: t("page.activity-duration.cancel"),
            validateLabel: t("page.activity-duration.validate"),
        },
    };

    const startTimeDay = useRef(today);
    const endTimeDay = useRef(today);

    const setStartEndTime = useCallback(
        (startTime: string[], endTime: string[]) => {
            let isAfter = false;
            const newStart = dayjs(startTime[currentIteration], "HH:mm");
            const newEnd = dayjs(endTime[currentIteration], "HH:mm");
            const init = dayjs(START_TIME_DAY, FORMAT_TIME);

            startTimeDay.current = addDayOfStartDay(newStart, init);
            endTimeDay.current = addDayEndTime(newStart, newEnd, init);

            if (startTimeDay.current.isAfter(endTimeDay.current)) {
                isAfter = true;
            }
            return [startTimeDay.current, endTimeDay.current, isAfter] as const;
        },
        [currentIteration],
    );

    const isAfterEndTime = useCallback(() => {
        const data = callbackHolder.getData();
        if (data) {
            const startTime = getValueOfData(data, FieldNameEnum.START_TIME) as string[];
            const endTime = getValueOfData(data, FieldNameEnum.END_TIME) as string[];

            dayjs.extend(customParseFormat);
            if (startTime && endTime) {
                const setter = setStartEndTime(startTime, endTime);
                startTimeDay.current = setter[0];
                endTimeDay.current = setter[1];
                return setter[2];
            }
        }
        return false;
    }, [setStartEndTime]);

    // when the start time < 4 and the end time is >=4, it is counted as the same day
    const addDayOfStartDay = (startTimeDay: dayjs.Dayjs, init: dayjs.Dayjs) => {
        if (startTimeDay.hour() < 4 && endTimeDay.current.isAfter(init)) {
            startTimeDay = startTimeDay.add(1, DAY_LABEL);
        }
        return startTimeDay;
    };

    const addDayEndTime = (startTimeDay: dayjs.Dayjs, endTimeDay: dayjs.Dayjs, init: dayjs.Dayjs) => {
        // when the end time is <=4, it is counted as the same day
        if (endTimeDay.hour() < 4 || endTimeDay.isSame(init)) {
            endTimeDay = endTimeDay.add(1, DAY_LABEL);
        }

        if (startTimeDay.isSame(endTimeDay) && startTimeDay.isSame(init)) {
            endTimeDay = endTimeDay.add(1, DAY_LABEL);
        }

        return endTimeDay;
    };

    const endTimeAfterStartTime = useCallback(
        (isAfter: boolean) => {
            let skip = false;
            if (isAfter) {
                setSnackbarText(t("page.activity-duration.hour-alert"));
                if (endTimeDay.current.isSame(lastEndTime)) {
                    skip = true;
                }
                setLastEndTime(endTimeDay.current);
            } else {
                skip = true;
            }
            setOpenSnackbar(!skip);
            return skip;
        },
        [endTimeDay, lastEndTime, t],
    );

    const checkTimeframeConsistency = useCallback(() => {
        const data = callbackHolder.getData();

        const startTime = getValueOfData(data, FieldNameEnum.START_TIME) as string[];
        const endTime = getValueOfData(data, FieldNameEnum.END_TIME) as string[];

        if (startTime.length != endTime.length) {
            setSnackbarText(t("page.activity-duration.error-time"));
            setOpenSnackbar(true);
        }
    }, [t]);

    const onNext = useCallback(() => {
        checkTimeframeConsistency();
        const isAfter = isAfterEndTime();
        const skip = endTimeAfterStartTime(isAfter);

        if (isAfter) {
            setLastEndTime(endTimeDay.current);
        }

        const wrongTimeValuesOrSkip = (skip && isAfter) || !isAfter;

        saveData(
            idSurvey,
            { ...context.data, ...callbackHolder.getData() },
            { localSaveOnly: wrongTimeValuesOrSkip },
        ).then(() => {
            if (wrongTimeValuesOrSkip) {
                navigate(
                    getLoopParameterizedNavigatePath(
                        idSurvey,
                        getNextLoopPage(currentPage, isRoute),
                        LoopEnum.ACTIVITY_OR_ROUTE,
                        currentIteration,
                    ),
                );
            }
        });
    }, [
        checkTimeframeConsistency,
        currentIteration,
        currentPage,
        endTimeAfterStartTime,
        endTimeDay,
        idSurvey,
        isAfterEndTime,
        isRoute,
        navigate,
    ]);

    const navIsClompleted = useCallback(
        (isCloture: boolean) => {
            if (isCloture) {
                navToActivitySummary(idSurvey);
            } else {
                navToActivityRoutePlanner(idSurvey, context.source);
            }
        },
        [context.source, idSurvey],
    );

    const onClose = useCallback(
        (forceQuit: boolean) => {
            const isCompleted = getValue(
                idSurvey,
                FieldNameEnum.ISCOMPLETED,
                currentIteration,
            ) as boolean;
            const isCloture = getValue(idSurvey, FieldNameEnum.ISCLOSED) as boolean;

            if (!openSnackbar) {
                if (!isCompleted) {
                    if (forceQuit) {
                        saveData(
                            idSurvey,
                            { ...context.data, ...callbackHolder.getData() },
                            { localSaveOnly: true },
                        ).then(() => {
                            navIsClompleted(isCloture);
                        });
                    } else {
                        setIsAlertDisplayed(true);
                    }
                } else {
                    navIsClompleted(isCloture);
                }
            }
        },
        [context.data, currentIteration, idSurvey, navIsClompleted, openSnackbar],
    );

    const handleCloseSnackBar = useCallback((_: unknown, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    }, []);

    const snackbarAction = (
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackBar}>
            <CloseIcon aria-label={t("accessibility.asset.mui-icon.close")} />
        </IconButton>
    );

    return (
        <LoopSurveyPage
            onNext={useCallback(() => onNext(), [onNext])}
            onClose={useCallback(() => onClose(false), [onClose])}
            currentStepIcon={stepData.stepIcon}
            currentStepIconAlt={stepData.stepIconAlt}
            currentStepNumber={stepData.stepNumber}
            currentStepLabel={stepData.stepLabel}
            isRoute={isRoute}
        >
            <FlexCenter>
                <Alert
                    isAlertDisplayed={isAlertDisplayed}
                    onCompleteCallBack={useCallback(() => setIsAlertDisplayed(false), [])}
                    onCancelCallBack={useCallback(cancel => onClose(cancel), [onClose])}
                    labels={getLabelsWhenQuit(isRoute)}
                    icon={<ErrorIcon aria-label={t("page.alert-when-quit.alt-alert-icon")} />}
                />
                <Snackbar
                    className={isDesktop() ? classes.snackbarDesktop : classes.snackbar}
                    open={openSnackbar}
                    onClose={handleCloseSnackBar}
                    message={snackbarText}
                    action={snackbarAction}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                    }}
                />
                <OrchestratorForStories
                    source={context.source}
                    data={getData(idSurvey)}
                    callbackHolder={callbackHolder}
                    page={getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE)}
                    subPage={getLoopPageSubpage(currentPage)}
                    iteration={currentIteration}
                    componentSpecificProps={specificProps}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

const useStyles = makeStylesEdt({ "name": { ActivityDurationPage } })(theme => ({
    snackbar: {
        height: "30%",
        "& .MuiSnackbarContent-root": {
            backgroundColor: theme.palette.error.light,
            color: theme.variables.alertActivity,
        },
        ".MuiSnackbarContent-message": {
            width: "90%",
        },
        ".MuiSnackbarContent-action": {
            width: "6%",
            paddingLeft: "0px",
            marginRight: "0px",
        },
    },
    snackbarDesktop: {
        height: "30%",
        "& .MuiSnackbarContent-root": {
            backgroundColor: theme.palette.error.light,
            color: theme.variables.alertActivity,
        },
        left: "30% !important",
        right: "0 !important",
        webkitTransform: "translateX(0%) !important",
        transform: "translateX(0%) !important",
        ".MuiSnackbarContent-message": {
            width: "90%",
        },
        ".MuiSnackbarContent-action": {
            width: "6%",
            paddingLeft: "0px",
            marginRight: "0px",
        },
    },
}));

export default ActivityDurationPage;
