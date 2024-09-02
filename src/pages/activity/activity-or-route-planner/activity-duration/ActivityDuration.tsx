import { Alert, makeStylesEdt, TimepickerSpecificProps } from "@inseefrlab/lunatic-edt";
import { IconButton, Snackbar } from "@mui/material";
import { ReactComponent as ErrorIcon } from "assets/illustration/error/activity.svg";
import { ReactComponent as CloseIcon } from "assets/illustration/mui-icon/close.svg";
import { ReactComponent as ArrowDownIcon } from "assets/illustration/mui-icon/expand-more.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { DAY_LABEL, FORMAT_TIME, MINUTE_LABEL, START_TIME_DAY } from "constants/constants";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { LoopEnum } from "enumerations/LoopEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { Fragment, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { getLabelsWhenQuit } from "service/alert-service";
import { getLoopInitialPage } from "service/loop-service";
import { getLoopPageSubpage, getNextLoopPage, getStepData } from "service/loop-stepper-service";
import {
    getLoopParameterizedNavigatePath,
    navToActivityRoutePlanner,
    navToActivitySummary,
    setEnviro,
} from "service/navigation-service";
import { isDesktop } from "service/responsive";
import { getActivitiesOrRoutes, surveyReadOnly } from "service/survey-activity-service";
import { getData, getValue, getValueOfData, saveDataLocally } from "service/survey-service";
import { getSurveyIdFromUrl } from "utils/utils";

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

    let startTimeDay: Dayjs;
    let endTimeDay: Dayjs;

    const isAfterEndTime = () => {
        const data = callbackHolder.getData();
        let isAfter = false;
        if (data) {
            const startTime = getValueOfData(data, FieldNameEnum.START_TIME) as string[];
            const endTime = getValueOfData(data, FieldNameEnum.END_TIME) as string[];

            dayjs.extend(customParseFormat);
            if (startTime && endTime) {
                const setter = setStartEndTime(isAfter, startTime, endTime);
                startTimeDay = setter[0] as dayjs.Dayjs;
                endTimeDay = setter[1] as dayjs.Dayjs;
                isAfter = setter[2] as boolean;
            }
        }
        return isAfter;
    };

    const setStartEndTime = (isAfter: boolean, startTime: string[], endTime: string[]) => {
        startTimeDay = dayjs(startTime[currentIteration], "HH:mm");
        endTimeDay = dayjs(endTime[currentIteration], "HH:mm");
        let init = dayjs(START_TIME_DAY, FORMAT_TIME);

        startTimeDay = addDayOfStartDay(startTimeDay, init);
        endTimeDay = addDayEndTime(startTimeDay, endTimeDay, init);

        if (startTimeDay.isAfter(endTimeDay)) {
            isAfter = true;
        }
        return [startTimeDay, endTimeDay, isAfter];
    };

    // when the start time < 4 and the end time is >=4, it is counted as the same day
    const addDayOfStartDay = (startTimeDay: dayjs.Dayjs, init: dayjs.Dayjs) => {
        if (startTimeDay.hour() < 4 && endTimeDay.isAfter(init)) {
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

    const endTimeAfterStartTime = (isAfter: boolean) => {
        let skip = false;
        if (isAfter) {
            setSnackbarText(t("page.activity-duration.hour-alert"));
            if (endTimeDay.isSame(lastEndTime)) {
                skip = true;
            }
            setLastEndTime(endTimeDay);
        } else {
            skip = true;
        }
        setOpenSnackbar(!skip);
        return skip;
    };

    const onNext = () => {
        const isAfter = isAfterEndTime();
        const skip = endTimeAfterStartTime(isAfter);

        if (isAfter) {
            setLastEndTime(endTimeDay);
        }

        if ((skip && isAfter) || !isAfter) {
            saveDataLocally(idSurvey, { ...context.data, ...callbackHolder.getData() }).then(() => {
                navigate(
                    getLoopParameterizedNavigatePath(
                        idSurvey,
                        getNextLoopPage(currentPage, isRoute),
                        LoopEnum.ACTIVITY_OR_ROUTE,
                        currentIteration,
                    ),
                );
            });
        }
    };

    const navIsClompleted = (isCloture: boolean) => {
        if (isCloture) {
            navToActivitySummary(idSurvey);
        } else {
            navToActivityRoutePlanner(idSurvey, context.source);
        }
    };

    const onClose = (forceQuit: boolean) => {
        const isCompleted = getValue(idSurvey, FieldNameEnum.ISCOMPLETED, currentIteration) as boolean;
        const isCloture = getValue(idSurvey, FieldNameEnum.ISCLOSED) as boolean;
        if (!openSnackbar) {
            if (!isCompleted) {
                if (forceQuit) {
                    saveDataLocally(idSurvey, callbackHolder.getData()).then(() => {
                        navIsClompleted(isCloture);
                    });
                } else {
                    setIsAlertDisplayed(true);
                }
            } else {
                navIsClompleted(isCloture);
            }
        }
    };

    const handleCloseSnackBar = useCallback(
        (event: React.SyntheticEvent | Event, reason?: string) => {
            if (reason === "clickaway") {
                return;
            }
            setOpenSnackbar(false);
        },
        [openSnackbar],
    );

    const snackbarAction = (
        <Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackBar}>
                <CloseIcon aria-label={t("accessibility.asset.mui-icon.close")} />
            </IconButton>
            <></>
        </Fragment>
    );

    return (
        <LoopSurveyPage
            onNext={useCallback(() => onNext(), [snackbarText, lastEndTime, openSnackbar])}
            onClose={useCallback(() => onClose(false), [isAlertDisplayed])}
            currentStepIcon={stepData.stepIcon}
            currentStepIconAlt={stepData.stepIconAlt}
            currentStepNumber={stepData.stepNumber}
            currentStepLabel={stepData.stepLabel}
            isRoute={isRoute}
        >
            <FlexCenter>
                <Alert
                    isAlertDisplayed={isAlertDisplayed}
                    onCompleteCallBack={useCallback(
                        () => setIsAlertDisplayed(false),
                        [isAlertDisplayed],
                    )}
                    onCancelCallBack={useCallback(cancel => onClose(cancel), [])}
                    labels={getLabelsWhenQuit(isRoute)}
                    icon={<ErrorIcon aria-label={t("page.alert-when-quit.alt-alert-icon")} />}
                ></Alert>
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
                    cbHolder={callbackHolder}
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
