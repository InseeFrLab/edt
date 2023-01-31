import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Snackbar } from "@mui/material";
import errorIcon from "assets/illustration/error/activity.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { Alert, makeStylesEdt, TimepickerSpecificProps } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { Fragment, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLabelsWhenQuit } from "service/alert-service";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import { getLoopPageSubpage, getNextLoopPage, getStepData } from "service/loop-stepper-service";
import {
    getLoopParameterizedNavigatePath,
    navToActivitRouteHome,
    setEnviro,
} from "service/navigation-service";
import { isDesktop } from "service/responsive";
import { getActivitiesOrRoutes } from "service/survey-activity-service";
import { getValue, saveData } from "service/survey-service";

const ActivityDurationPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    const { classes } = useStyles();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.ACTIVITY_DURATION;
    const stepData = getStepData(currentPage, context.isRoute);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;
    const activitiesAct = getActivitiesOrRoutes(t, context.idSurvey).activitiesRoutesOrGaps;
    const isRoute = getValue(context.idSurvey, FieldNameEnum.ISROUTE, currentIteration) as boolean;

    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);
    const [snackbarText, setSnackbarText] = useState<string | undefined>(undefined);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [lastEndTime, setLastEndTime] = useState(dayjs());

    const specificProps: TimepickerSpecificProps = {
        activitiesAct: activitiesAct,
        defaultValue: true,
    };

    let startTimeDay: Dayjs;
    let endTimeDay: Dayjs;

    const isAfterEndTime = () => {
        const data = callbackHolder.getData();
        let isAfter = false;
        if (data) {
            const startTime = data.COLLECTED?.[FieldNameEnum.STARTTIME]?.COLLECTED as string[];
            const endTime = data.COLLECTED?.[FieldNameEnum.ENDTIME]?.COLLECTED as string[];

            dayjs.extend(customParseFormat);
            if (startTime && endTime) {
                startTimeDay = dayjs(startTime[currentIteration], "HH:mm");
                endTimeDay = dayjs(endTime[currentIteration], "HH:mm");
                if (endTimeDay.hour() < 4) {
                    endTimeDay = endTimeDay.add(1, "day");
                }
                if (startTimeDay.hour() < 4) {
                    startTimeDay = startTimeDay.add(1, "day");
                }
                if (startTimeDay.isAfter(endTimeDay)) {
                    isAfter = true;
                }
            }
        }
        return isAfter;
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
            saveData(context.idSurvey, callbackHolder.getData()).then(() => {
                navigate(
                    getLoopParameterizedNavigatePath(
                        getNextLoopPage(currentPage, context.isRoute),
                        LoopEnum.ACTIVITY_OR_ROUTE,
                        currentIteration,
                    ),
                );
            });
        }
    };

    const onClose = (forceQuit: boolean) => {
        const isCompleted = getValue(context.idSurvey, FieldNameEnum.ISCOMPLETED, currentIteration);
        if (!openSnackbar) {
            if (!isCompleted) {
                if (forceQuit) {
                    saveData(context.idSurvey, callbackHolder.getData()).then(() => {
                        navToActivitRouteHome();
                    });
                } else {
                    setIsAlertDisplayed(true);
                }
            } else {
                navToActivitRouteHome();
            }
        }
    };

    const handleCloseSnackBar = useCallback((event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    }, []);

    const snackbarAction = (
        <Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackBar}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>
    );

    return (
        <LoopSurveyPage
            onNext={onNext}
            onClose={() => onClose(false)}
            currentStepIcon={stepData.stepIcon}
            currentStepIconAlt={stepData.stepIconAlt}
            currentStepNumber={stepData.stepNumber}
            currentStepLabel={stepData.stepLabel}
            isRoute={isRoute}
        >
            <FlexCenter>
                <Alert
                    isAlertDisplayed={isAlertDisplayed}
                    onCompleteCallBack={() => setIsAlertDisplayed(false)}
                    onCancelCallBack={onClose}
                    labels={getLabelsWhenQuit(isRoute)}
                    icon={errorIcon}
                    errorIconAlt={t("page.activity-duration.alt-alert-icon")}
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
                    data={context.data}
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
