import CloseIcon from "@mui/icons-material/Close";
import { Box, Divider, IconButton, Snackbar, Typography } from "@mui/material";
import empty_activity from "assets/illustration/empty-activity.svg";
import { default as errorIcon } from "assets/illustration/error/activity.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PageIcon from "components/commons/PageIcon/PageIcon";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import ActivityOrRouteCard from "components/edt/ActivityCard/ActivityOrRouteCard";
import AddActivityOrRoute from "components/edt/AddActivityOrRoute/AddActivityOrRoute";
import { ActivityRouteOrGap } from "interface/entity/ActivityRouteOrGap";
import { LunaticModel, OrchestratorContext } from "interface/lunatic/Lunatic";
import {
    Alert,
    formateDateToFrenchFormat,
    generateDateFromStringInput,
    makeStylesEdt,
} from "lunatic-edt";
import { callbackHolder } from "orchestrator/Orchestrator";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopSize, LoopEnum, setLoopSize } from "service/loop-service";
import {
    getCurrentNavigatePath,
    getLoopParameterizedNavigatePath,
    getOrchestratorPage,
    navFullPath,
    navToActivitRouteHome,
    navToEditActivity,
    navToHelp,
    navToHome,
    setEnviro,
} from "service/navigation-service";
import { isDesktop } from "service/responsive";
import { deleteActivity, getActivitiesOrRoutes } from "service/survey-activity-service";
import {
    FieldNameEnum,
    getPrintedFirstName,
    getSurveyDate,
    saveData,
    setValue,
} from "service/survey-service";
import { v4 as uuidv4 } from "uuid";

const ActivityOrRoutePlannerPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const context: OrchestratorContext = useOutletContext();
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const [isSubchildDisplayed, setIsSubChildDisplayed] = React.useState(false);
    const [isAddActivityOrRouteOpen, setIsAddActivityOrRouteOpen] = React.useState(false);
    const [isRoute, setIsRoute] = React.useState(false);
    const [addActivityOrRouteFromGap, setAddActivityOrRouteFromGap] = React.useState(false);
    const [gapStartTime, setGapStartTime] = React.useState<string>();
    const [gapEndTime, setGapEndTime] = React.useState<string>();
    const [activityOrRoute, setActivityOrRoute] = React.useState<ActivityRouteOrGap | undefined>(
        undefined,
    );
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    setEnviro(context, useNavigate(), callbackHolder);
    const isItDesktop = isDesktop();

    let contextIteration = 0;
    const { activitiesRoutesOrGaps, overlaps } = getActivitiesOrRoutes(
        t,
        context.idSurvey,
        context.source,
    );
    const [snackbarText, setSnackbarText] = React.useState<string | undefined>(undefined);
    const surveyDate = getSurveyDate(context.idSurvey) || "";
    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);
    const [skip, setSkip] = useState<boolean>(false);

    const alertLabels = {
        boldContent: t("page.alert-when-quit.activity-planner.alert-content-close-bold"),
        content: t("page.alert-when-quit.activity-planner.alert-content-close"),
        cancel: t("page.alert-when-quit.alert-cancel"),
        complete: t("page.alert-when-quit.alert-closed"),
    };

    const isChildDisplayed = (path: string): boolean => {
        return path.split(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER)[1].length > 0 ? true : false;
    };

    useEffect(() => {
        const isActivityPlanner =
            location.pathname?.split("/")[3] == EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER &&
            location.pathname?.split("/")[4] == null;
        if (isActivityPlanner) {
            const act = getActivitiesOrRoutes(t, context.idSurvey, context.source);
            if (act.overlaps.length > 0) {
                setSnackbarText(
                    t("page.activity-planner.start-alert") +
                        overlaps
                            .map(o => o?.prev?.concat(t("page.activity-planner.and"), o?.current || ""))
                            .join(", ") +
                        t("page.activity-planner.end-alert"),
                );
                if (!skip) setOpenSnackbar(true);
            }
        } else {
            setSkip(false);
        }
    });

    useEffect(() => {
        //The loop have to have a default size in source but it's updated depending on the data array size
        setLoopSize(
            context.source,
            LoopEnum.ACTIVITY_OR_ROUTE,
            getLoopSize(context.idSurvey, LoopEnum.ACTIVITY_OR_ROUTE),
        );
        if (overlaps.length > 0) {
            setSnackbarText(
                t("page.activity-planner.start-alert") +
                    overlaps
                        .map(o => o?.prev?.concat(t("page.activity-planner.and"), o?.current || ""))
                        .join(", ") +
                    t("page.activity-planner.end-alert"),
            );
            if (!skip) setOpenSnackbar(true);
        }
    }, []);

    useEffect(() => {
        const currentIsChildDisplay = isChildDisplayed(location.pathname);
        if (currentIsChildDisplay !== isSubchildDisplayed) {
            setIsSubChildDisplayed(currentIsChildDisplay);
        }
    }, [location]);

    const onFinish = (closed: boolean) => {
        if (closed) {
            const data = setValue(context.idSurvey, FieldNameEnum.ISCLOSED, true);
            saveData(context.idSurvey, data ? data : callbackHolder.getData()).then(() => {
                navigate(
                    getCurrentNavigatePath(
                        context.idSurvey,
                        context.surveyRootPage,
                        getOrchestratorPage(
                            EdtRoutesNameEnum.GREATEST_ACTIVITY_DAY,
                            EdtRoutesNameEnum.ACTIVITY,
                        ),
                    ),
                );
            });
        } else {
            setIsAlertDisplayed(true);
        }
    };

    const onAddActivityOrRoute = (isRouteBool: boolean) => {
        const loopSize = setLoopSize(
            context.source,
            LoopEnum.ACTIVITY_OR_ROUTE,
            getLoopSize(context.idSurvey, LoopEnum.ACTIVITY_OR_ROUTE) + 1,
        );
        contextIteration = loopSize - 1;
        const routeData = setValue(
            context.idSurvey,
            FieldNameEnum.ISROUTE,
            isRouteBool,
            contextIteration,
        );
        saveData(context.idSurvey, routeData || {}).then(() => {
            navToActivityOrRoute(contextIteration, isRouteBool);
        });
    };

    const onAddActivityOrRouteFromGap = (
        isRouteBool: boolean,
        startTime: string | undefined,
        endTime: string | undefined,
    ) => {
        const loopSize = setLoopSize(
            context.source,
            LoopEnum.ACTIVITY_OR_ROUTE,
            getLoopSize(context.idSurvey, LoopEnum.ACTIVITY_OR_ROUTE) + 1,
        );
        contextIteration = loopSize - 1;

        setValue(context.idSurvey, FieldNameEnum.STARTTIME, startTime || null, contextIteration);
        setValue(context.idSurvey, FieldNameEnum.ENDTIME, endTime || null, contextIteration);
        const updatedData = setValue(
            context.idSurvey,
            FieldNameEnum.ISROUTE,
            isRouteBool,
            contextIteration,
        );

        saveData(context.idSurvey, updatedData || {}).then(() => {
            onCloseAddActivityOrRoute();
            setIsRoute(isRouteBool);
            navigate(
                getLoopParameterizedNavigatePath(
                    EdtRoutesNameEnum.ACTIVITY_DURATION,
                    LoopEnum.ACTIVITY_OR_ROUTE,
                    contextIteration,
                ),
            );
            setAddActivityOrRouteFromGap(false);
        });
    };

    const onOpenAddActivityOrRoute = (startTime?: string, endTime?: string) => {
        setIsAddActivityOrRouteOpen(true);
        if (startTime && endTime) {
            setAddActivityOrRouteFromGap(true);
            setGapStartTime(startTime);
            setGapEndTime(endTime);
        }
    };

    const onCloseAddActivityOrRoute = () => {
        setIsAddActivityOrRouteOpen(false);
        setAddActivityOrRouteFromGap(false);
    };

    const onEdit = () => {
        navFullPath(EdtRoutesNameEnum.EDIT_GLOBAL_INFORMATION, EdtRoutesNameEnum.ACTIVITY);
    };

    const onHelp = () => {
        navToHelp();
    };

    const navToActivityOrRoute = (iteration: number, isItRoute?: boolean): void => {
        setIsSubChildDisplayed(true);
        setIsRoute(isItRoute ? true : false);
        navigate(
            getCurrentNavigatePath(
                context.idSurvey,
                context.surveyRootPage,
                context.source.maxPage,
                LoopEnum.ACTIVITY_OR_ROUTE,
                iteration,
            ),
        );
        setIsAddActivityOrRouteOpen(false);
    };

    const onEditActivityOrRoute = useCallback((iteration: number, activity: ActivityRouteOrGap) => {
        setActivityOrRoute(activity);
        navToEditActivity(iteration);
    }, []);

    const onDeleteActivityOrRoute = useCallback(
        (idSurvey: string, source: LunaticModel, iteration: number) => {
            deleteActivity(idSurvey, source, iteration);
            activitiesRoutesOrGaps.splice(iteration);
            navToActivitRouteHome();
        },
        [],
    );

    const handleCloseSnackBar = useCallback((_event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
        setSkip(true);
    }, []);

    const snackbarAction = (
        <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackBar}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <>
            <Box className={classes.surveyPageBox}>
                {(isItDesktop || !isSubchildDisplayed) && (
                    <Box className={classes.innerSurveyPageBox}>
                        <SurveyPage
                            onNavigateBack={() => navToHome()}
                            onPrevious={() => navToHome()}
                            onEdit={onEdit}
                            onHelp={onHelp}
                            firstName={getPrintedFirstName(context.idSurvey)}
                            firstNamePrefix={t("component.survey-page-edit-header.planning-of")}
                            onFinish={() => onFinish(false)}
                            onAdd={onOpenAddActivityOrRoute}
                            finishLabel={t("common.navigation.finish")}
                            addLabel={
                                activitiesRoutesOrGaps.length === 0
                                    ? t("common.navigation.add")
                                    : undefined
                            }
                            activityProgressBar={true}
                            idSurvey={context.idSurvey}
                        >
                            <Box
                                className={
                                    isItDesktop && isSubchildDisplayed
                                        ? classes.outerContentBox
                                        : classes.fullHeight
                                }
                            >
                                <Box
                                    className={
                                        isItDesktop && isSubchildDisplayed
                                            ? classes.innerContentBox
                                            : classes.fullHeight
                                    }
                                >
                                    <Box className={classes.innerContentScroll}>
                                        <FlexCenter>
                                            <Alert
                                                isAlertDisplayed={isAlertDisplayed}
                                                onCompleteCallBack={() => onFinish(true)}
                                                onCancelCallBack={() => setIsAlertDisplayed(false)}
                                                labels={alertLabels}
                                                icon={errorIcon}
                                                errorIconAlt={t("page.alert-when-quit.alt-alert-icon")}
                                            ></Alert>
                                            <Box className={classes.infoBox}>
                                                <Typography className={classes.label}>
                                                    {t("page.activity-planner.activity-for-day")}
                                                </Typography>
                                                <Typography className={classes.date}>
                                                    {formateDateToFrenchFormat(
                                                        generateDateFromStringInput(surveyDate),
                                                    )}
                                                </Typography>
                                            </Box>
                                        </FlexCenter>

                                        <Box className={classes.activityCardsContainer}>
                                            {activitiesRoutesOrGaps.length === 0 ? (
                                                <>
                                                    <PageIcon
                                                        srcIcon={empty_activity}
                                                        altIcon={t(
                                                            "accessibility.asset.empty-activity-alt",
                                                        )}
                                                    />
                                                    <FlexCenter>
                                                        <Typography
                                                            className={cx(classes.label, classes.grey)}
                                                        >
                                                            {t("page.activity-planner.no-activity")}
                                                        </Typography>
                                                    </FlexCenter>
                                                </>
                                            ) : (
                                                <>
                                                    {activitiesRoutesOrGaps.map(activity => (
                                                        <FlexCenter key={uuidv4()}>
                                                            <ActivityOrRouteCard
                                                                labelledBy={""}
                                                                describedBy={""}
                                                                onClick={() =>
                                                                    navToActivityOrRoute(
                                                                        activity.iteration || 0,
                                                                        activity.isRoute,
                                                                    )
                                                                }
                                                                onClickGap={onOpenAddActivityOrRoute}
                                                                activityOrRoute={activity}
                                                                onEdit={() =>
                                                                    onEditActivityOrRoute(
                                                                        activity.iteration || 0,
                                                                        activity,
                                                                    )
                                                                }
                                                                onDelete={() =>
                                                                    onDeleteActivityOrRoute(
                                                                        context.idSurvey,
                                                                        context.source,
                                                                        activity.iteration ?? 0,
                                                                    )
                                                                }
                                                            />
                                                        </FlexCenter>
                                                    ))}
                                                </>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </SurveyPage>

                        <AddActivityOrRoute
                            labelledBy={""}
                            describedBy={""}
                            onClickActivity={
                                addActivityOrRouteFromGap
                                    ? () => onAddActivityOrRouteFromGap(false, gapStartTime, gapEndTime)
                                    : () => onAddActivityOrRoute(false)
                            }
                            onClickRoute={
                                addActivityOrRouteFromGap
                                    ? () => onAddActivityOrRouteFromGap(true, gapStartTime, gapEndTime)
                                    : () => onAddActivityOrRoute(true)
                            }
                            handleClose={onCloseAddActivityOrRoute}
                            open={isAddActivityOrRouteOpen}
                        />

                        {snackbarText && openSnackbar && (
                            <Snackbar
                                className={classes.snackbar}
                                open={openSnackbar}
                                autoHideDuration={100000}
                                onClose={handleCloseSnackBar}
                                message={snackbarText}
                                action={snackbarAction}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                }}
                            />
                        )}
                    </Box>
                )}
                <Box
                    className={cx(
                        isSubchildDisplayed && isItDesktop ? classes.outletBoxDesktop : "",
                        isSubchildDisplayed && !isItDesktop ? classes.outletBoxMobileTablet : "",
                    )}
                >
                    {isItDesktop && isSubchildDisplayed && <Divider orientation="vertical" light />}
                    <Outlet
                        context={{
                            source: context.source,
                            data: context.data,
                            idSurvey: context.idSurvey,
                            surveyRootPage: context.surveyRootPage,
                            isRoute: isRoute,
                            activityOrRoute: activityOrRoute,
                        }}
                    />
                </Box>
            </Box>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { ActivityOrRoutePlannerPage } })(theme => ({
    snackbar: {
        bottom: "90px !important",
        "& .MuiSnackbarContent-root": {
            backgroundColor: theme.palette.error.light,
            color: theme.variables.alertActivity,
        },
    },
    infoBox: {
        width: "350px",
        padding: "1rem 0.25rem 0.5rem 1rem",
        marginBottom: "1rem",
    },
    label: {
        fontSize: "14px",
    },
    date: {
        fontSize: "18px",
        fontWeight: "bold",
    },
    grey: {
        color: theme.palette.action.hover,
    },
    surveyPageBox: {
        flexGrow: "1",
        display: "flex",
        alignItems: "flex-start",
        overflow: "auto",
    },
    outletBoxDesktop: {
        flexGrow: "12",
        display: "flex",
        height: "100%",
        width: "100%",
    },
    outletBoxMobileTablet: {
        flexGrow: "1",
        display: "flex",
        height: "100%",
    },
    innerContentBox: {
        border: "1px solid transparent",
        borderRadius: "20px",
        backgroundColor: theme.palette.background.default,
        flexGrow: "1",
        display: "flex",
        padding: "1rem 0",
    },
    activityCardsContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, max-content))",
        gridGap: "1rem",
        justifyContent: "center",
        padding: "initial",
    },
    innerContentScroll: {
        overflowY: "auto",
        flexGrow: "1",
        paddingBottom: "1rem",
    },
    outerContentBox: {
        padding: "0.5rem",
        flexGrow: "1",
        display: "flex",
        backgroundColor: theme.variables.white,
        height: "100%",
    },
    innerSurveyPageBox: {
        flexGrow: "1",
        height: "100%",
        display: "flex",
    },
    fullHeight: {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        flexGrow: "1",
    },
}));

export default ActivityOrRoutePlannerPage;
