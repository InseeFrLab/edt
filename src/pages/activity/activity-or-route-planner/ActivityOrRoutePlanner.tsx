import {
    Alert,
    formateDateToFrenchFormat,
    generateDateFromStringInput,
    Info,
    InfoProps,
    makeStylesEdt,
    TooltipInfo,
} from "@inseefrlab/lunatic-edt";
import { Box, Divider, IconButton, Snackbar, Switch, Typography } from "@mui/material";
import empty_activity from "assets/illustration/empty-activity.svg";
import { default as errorIcon } from "assets/illustration/error/activity.svg";
import InfoIcon from "assets/illustration/info.svg";
import close from "assets/illustration/mui-icon/close.svg";
import InfoTooltipIcon from "assets/illustration/mui-icon/info.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PageIcon from "components/commons/PageIcon/PageIcon";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import ActivityOrRouteCard from "components/edt/ActivityCard/ActivityOrRouteCard";
import AddActivityOrRoute from "components/edt/AddActivityOrRoute/AddActivityOrRoute";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { LoopEnum } from "enumerations/LoopEnum";
import { SourcesEnum } from "enumerations/SourcesEnum";
import { ActivityRouteOrGap } from "interface/entity/ActivityRouteOrGap";
import { LunaticModel, OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder } from "orchestrator/Orchestrator";
import React, { useCallback, useEffect, useState } from "react";
import { isAndroid, isIOS, isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { getLoopSize, setLoopSize } from "service/loop-service";
import {
    getCurrentNavigatePath,
    getLoopParameterizedNavigatePath,
    getOrchestratorPage,
    navFullPath,
    navToActivityRoutePlanner,
    navToEditActivity,
    navToHelp,
    navToHome,
    setEnviro,
} from "service/navigation-service";
import { getLanguage } from "service/referentiel-service";
import { isDesktop, isPwa } from "service/responsive";
import {
    deleteActivity,
    getActivitiesOrRoutes,
    getScore,
    surveyReadOnly,
} from "service/survey-activity-service";
import {
    existVariableEdited,
    getData,
    getPrintedFirstName,
    getSource,
    getSurveyDate,
    getSurveyRights,
    isDemoMode,
    lockSurvey,
    saveData,
    setValue,
    surveyLocked,
} from "service/survey-service";
import { isReviewer } from "service/user-service";
import { v4 as uuidv4 } from "uuid";

const ActivityOrRoutePlannerPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const context: OrchestratorContext = useOutletContext();
    const source =
        context?.source?.components != null ? context.source : getSource(SourcesEnum.ACTIVITY_SURVEY);

    let idSurveyPath = location.pathname.split("activity/")[1].split("/")[0];
    let idSurvey = context.idSurvey != idSurveyPath ? idSurveyPath : context.idSurvey;

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
    const { activitiesRoutesOrGaps, overlaps } = getActivitiesOrRoutes(t, idSurvey, source);
    const [snackbarText, setSnackbarText] = React.useState<string | undefined>(undefined);
    const surveyDate = getSurveyDate(idSurvey) || "";
    const modifiable = !surveyReadOnly(context.rightsSurvey);

    const { classes, cx } = useStyles({
        "isIOS": isIOS,
        "modifiable": modifiable,
        "isOpen": context.isOpenHeader ?? false,
    });

    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);
    const [skip, setSkip] = useState<boolean>(false);
    const [score, setScore] = React.useState<number | undefined>(undefined);

    const [isAlertLockDisplayed, setIsAlertLockDisplayed] = useState<boolean>(false);
    const [isLocked, setIsLocked] = useState<boolean>(surveyLocked(idSurvey));

    const alertLabels = {
        boldContent: t("page.alert-when-quit.activity-planner.alert-content-close-bold"),
        content: t("page.alert-when-quit.activity-planner.alert-content-close"),
        cancel: t("page.alert-when-quit.alert-cancel"),
        complete: t("page.alert-when-quit.alert-closed"),
    };

    const alertLockLabels = {
        boldContent: t("page.reviewer-home.lock-popup.boldContent"),
        content: t("page.reviewer-home.lock-popup.content"),
        cancel: t("page.alert-when-quit.alert-cancel"),
        complete: t("page.reviewer-home.lock-survey"),
    };

    const variableEdited = existVariableEdited(idSurvey);

    const alertUnlockLabels = {
        boldContent: variableEdited
            ? t("page.reviewer-home.lock-popup.boldContent-not-unlocked")
            : t("page.reviewer-home.lock-popup.boldContent-not-locked"),
        content: variableEdited
            ? t("page.reviewer-home.lock-popup.content-not-unlocked")
            : t("page.reviewer-home.lock-popup.content-not-locked"),
        cancel: variableEdited ? undefined : t("page.alert-when-quit.alert-cancel"),
        complete: variableEdited
            ? t("page.reviewer-home.lock-popup.confirm-button")
            : t("page.reviewer-home.not-lock-survey"),
    };

    const isChildDisplayed = (path: string): boolean => {
        return path.split(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER)[1].length > 0 ? true : false;
    };

    useEffect(() => {
        const isActivityPlanner =
            location.pathname?.split("/")[3] == EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER &&
            location.pathname?.split("/")[4] == null;
        if (isActivityPlanner) {
            const act = getActivitiesOrRoutes(t, idSurvey, source);
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
        idSurvey = context.idSurvey != idSurveyPath ? idSurveyPath : context.idSurvey;
        context.idSurvey = idSurvey;
    });

    useEffect(() => {
        //The loop have to have a default size in source but it's updated depending on the data array size
        setLoopSize(
            source,
            LoopEnum.ACTIVITY_OR_ROUTE,
            getLoopSize(idSurvey, LoopEnum.ACTIVITY_OR_ROUTE),
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

    const onFinish = (closed: boolean, idSurvey: string) => {
        if (closed) {
            const data = setValue(idSurvey, FieldNameEnum.ISCLOSED, true);
            saveData(idSurvey, data ? data : callbackHolder.getData()).then(() => {
                navigate(
                    getCurrentNavigatePath(
                        idSurvey,
                        context.surveyRootPage,
                        getOrchestratorPage(
                            EdtRoutesNameEnum.GREATEST_ACTIVITY_DAY,
                            EdtRoutesNameEnum.ACTIVITY,
                        ),
                        source,
                    ),
                );
            });
        } else {
            setIsAlertDisplayed(true);
        }
    };

    const onAddActivityOrRoute = (isRouteBool: boolean, idSurvey: string) => {
        const loopSize = setLoopSize(
            source,
            LoopEnum.ACTIVITY_OR_ROUTE,
            getLoopSize(idSurvey, LoopEnum.ACTIVITY_OR_ROUTE) + 1,
        );
        contextIteration = loopSize - 1;
        const routeData = setValue(idSurvey, FieldNameEnum.ISROUTE, isRouteBool, contextIteration);
        saveData(idSurvey, routeData).then(() => {
            navToActivityOrRoute(idSurvey, contextIteration, isRouteBool);
        });
    };

    const onAddActivityOrRouteFromGap = (
        idSurvey: string,
        isRouteBool: boolean,
        startTime: string | undefined,
        endTime: string | undefined,
    ) => {
        const loopSize = setLoopSize(
            source,
            LoopEnum.ACTIVITY_OR_ROUTE,
            getLoopSize(idSurvey, LoopEnum.ACTIVITY_OR_ROUTE) + 1,
        );
        contextIteration = loopSize - 1;
        setValue(idSurvey, FieldNameEnum.START_TIME, startTime || null, contextIteration);
        setValue(idSurvey, FieldNameEnum.END_TIME, endTime || null, contextIteration);
        const updatedData = setValue(idSurvey, FieldNameEnum.ISROUTE, isRouteBool, contextIteration);
        saveData(idSurvey, updatedData).then(() => {
            onCloseAddActivityOrRoute();
            setIsRoute(isRouteBool);
            navigate(
                getLoopParameterizedNavigatePath(
                    context.idSurvey,
                    EdtRoutesNameEnum.ACTIVITY_DURATION,
                    LoopEnum.ACTIVITY_OR_ROUTE,
                    contextIteration,
                ),
            );
            setAddActivityOrRouteFromGap(false);
        });
    };

    const onOpenAddActivityOrRoute = useCallback(
        (startTime?: string, endTime?: string) => {
            setIsAddActivityOrRouteOpen(true);
            if (startTime && endTime) {
                setAddActivityOrRouteFromGap(true);
                setGapStartTime(startTime);
                setGapEndTime(endTime);
            }
        },
        [addActivityOrRouteFromGap, gapStartTime, gapEndTime],
    );

    const onCloseAddActivityOrRoute = useCallback(() => {
        setIsAddActivityOrRouteOpen(false);
        setAddActivityOrRouteFromGap(false);
    }, [isAddActivityOrRouteOpen, addActivityOrRouteFromGap]);

    const onEdit = useCallback(() => {
        navFullPath(
            context.idSurvey,
            EdtRoutesNameEnum.EDIT_GLOBAL_INFORMATION,
            EdtRoutesNameEnum.ACTIVITY,
        );
    }, []);

    const onHelp = useCallback(() => {
        navToHelp();
    }, []);

    const navToActivityOrRoute = (idSurvey: string, iteration: number, isItRoute?: boolean): void => {
        setIsSubChildDisplayed(true);
        setIsRoute(isItRoute ? true : false);
        navigate(
            getCurrentNavigatePath(
                idSurvey,
                context.surveyRootPage,
                source.maxPage,
                source,
                LoopEnum.ACTIVITY_OR_ROUTE,
                iteration,
            ),
        );
        setIsAddActivityOrRouteOpen(false);
    };

    const onEditActivityOrRoute = useCallback((iteration: number, activity: ActivityRouteOrGap) => {
        setActivityOrRoute(activity);
        navToEditActivity(context.idSurvey, iteration);
    }, []);

    const onDeleteActivityOrRoute = useCallback(
        (idSurvey: string, source: LunaticModel, iteration: number) => {
            deleteActivity(idSurvey, source, iteration);
            activitiesRoutesOrGaps.splice(iteration);
            navToActivityRoutePlanner(context.idSurvey, source);
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
                <img src={close} alt={t("accessibility.asset.mui-icon.close")} />
            </IconButton>
        </React.Fragment>
    );

    useEffect(() => {
        setScore(getScore(idSurvey, t));
    }, [activitiesRoutesOrGaps]);

    const navToActivityRouteHome = useCallback(() => {
        navToHome();
    }, []);

    const onEditActivity = useCallback(
        (iteration: number, activity: ActivityRouteOrGap) => () =>
            onEditActivityOrRoute(iteration, activity),
        [],
    );

    const onDeleteActivity = useCallback(
        (idSurvey: string, source: LunaticModel, iteration: number) => () =>
            onDeleteActivityOrRoute(idSurvey, source, iteration),
        [],
    );

    const onAddActivity = useCallback(
        (idSurvey: string, isRoute: boolean) => () => onAddActivityOrRoute(isRoute, idSurvey),
        [],
    );

    const onAddActivityGap = useCallback(
        (idSurvey: string, isRoute: boolean, startTime?: string, endTime?: string) => () =>
            onAddActivityOrRouteFromGap(idSurvey, isRoute, startTime, endTime),
        [],
    );

    const addActivityOrRoute = (idSurvey: string, isRoute: boolean) => {
        return addActivityOrRouteFromGap
            ? onAddActivityGap(idSurvey, isRoute, gapStartTime, gapEndTime)
            : onAddActivity(idSurvey, isRoute);
    };

    const navToCard = useCallback(
        (iteration: number, isRoute?: boolean) => () =>
            navToActivityOrRoute(idSurvey, iteration, isRoute),
        [],
    );

    const closeActivity = useCallback(
        (closed: boolean, surveyId: string) => () => onFinish(closed, surveyId),
        [],
    );

    const displayAlert = useCallback(
        (setDisplayAlert: React.Dispatch<React.SetStateAction<boolean>>, display: boolean) => () =>
            setDisplayAlert(display),
        [],
    );

    const infoLabels: InfoProps = {
        boldText: t("page.activity-planner.info"),
        infoIcon: InfoIcon,
        infoIconAlt: t("accessibility.asset.info.info-alt"),
        infoIconTooltip: InfoTooltipIcon,
        infoIconTooltipAlt: t("accessibility.asset.info.info-alt"),
        border: true,
    };

    const titleLabels = {
        boldTitle: formateDateToFrenchFormat(generateDateFromStringInput(surveyDate), getLanguage()),
        typeTitle: "h1",
    };

    const heightClass = isPwa() ? classes.fullHeight : classes.fullHeightNav;

    const lock = useCallback(() => {
        lockSurvey(idSurvey).then(() => {
            setIsLocked(true);
            setIsAlertLockDisplayed(false);
        });
    }, [idSurvey]);

    const lockActivity = useCallback(() => setIsAlertLockDisplayed(true), []);

    const isReviewerMode = isReviewer() && !isDemoMode();

    return (
        <>
            <Box
                className={cx(
                    classes.surveyPageBox,
                    !isPwa() && isMobile && (isIOS || isAndroid) ? classes.surveyPageBoxTablet : "",
                )}
            >
                {(isItDesktop || !isSubchildDisplayed) && (
                    <Box className={classes.innerSurveyPageBox}>
                        <SurveyPage
                            onNavigateBack={navToActivityRouteHome}
                            onPrevious={navToActivityRouteHome}
                            onEdit={onEdit}
                            onHelp={onHelp}
                            firstName={getPrintedFirstName(idSurvey)}
                            firstNamePrefix={t("component.survey-page-edit-header.planning-of")}
                            onFinish={closeActivity(false, idSurvey)}
                            onAdd={onOpenAddActivityOrRoute}
                            finishLabel={t("common.navigation.finish")}
                            addLabel={
                                activitiesRoutesOrGaps.length === 0
                                    ? t("common.navigation.add")
                                    : undefined
                            }
                            activityProgressBar={true}
                            idSurvey={idSurvey}
                            score={score}
                            modifiable={modifiable}
                        >
                            <Box
                                className={
                                    isItDesktop && isSubchildDisplayed
                                        ? classes.outerContentBox
                                        : heightClass
                                }
                            >
                                <Box
                                    className={
                                        isItDesktop && isSubchildDisplayed
                                            ? classes.innerContentBox
                                            : heightClass
                                    }
                                >
                                    <Box className={classes.innerContentScroll}>
                                        <FlexCenter>
                                            <Alert
                                                isAlertDisplayed={isAlertDisplayed}
                                                onCompleteCallBack={closeActivity(true, idSurvey)}
                                                onCancelCallBack={displayAlert(
                                                    setIsAlertDisplayed,
                                                    false,
                                                )}
                                                labels={alertLabels}
                                                icon={errorIcon}
                                                errorIconAlt={t("page.alert-when-quit.alt-alert-icon")}
                                            ></Alert>
                                            <Box
                                                className={
                                                    isReviewerMode && activitiesRoutesOrGaps.length !== 0
                                                        ? classes.infoReviewerBox
                                                        : classes.infoBox
                                                }
                                            >
                                                {activitiesRoutesOrGaps.length !== 0 &&
                                                    (isReviewerMode ? (
                                                        <Box className={classes.headerActivityLockBox}>
                                                            <>
                                                                <Alert
                                                                    isAlertDisplayed={
                                                                        isAlertLockDisplayed
                                                                    }
                                                                    onCompleteCallBack={lock}
                                                                    onCancelCallBack={displayAlert(
                                                                        setIsAlertLockDisplayed,
                                                                        false,
                                                                    )}
                                                                    labels={
                                                                        isLocked
                                                                            ? alertUnlockLabels
                                                                            : alertLockLabels
                                                                    }
                                                                    icon={errorIcon}
                                                                    errorIconAlt={t(
                                                                        "page.alert-when-quit.alt-alert-icon",
                                                                    )}
                                                                ></Alert>
                                                            </>
                                                            <Box className={classes.headerActivityBox}>
                                                                <Typography className={classes.label}>
                                                                    {t(
                                                                        "page.activity-planner.activity-for-day",
                                                                    )}
                                                                </Typography>
                                                                <TooltipInfo
                                                                    infoLabels={infoLabels}
                                                                    titleLabels={titleLabels}
                                                                />
                                                            </Box>
                                                            <Box className={classes.headerLockBox}>
                                                                <Typography
                                                                    className={classes.labelLock}
                                                                >
                                                                    {t("page.reviewer-home.lock-survey")}
                                                                </Typography>

                                                                <Switch
                                                                    checked={isLocked}
                                                                    onChange={lockActivity}
                                                                    disabled={!modifiable}
                                                                />
                                                            </Box>
                                                        </Box>
                                                    ) : (
                                                        <>
                                                            <Typography className={classes.label}>
                                                                {t(
                                                                    "page.activity-planner.activity-for-day",
                                                                )}
                                                            </Typography>
                                                            <TooltipInfo
                                                                infoLabels={infoLabels}
                                                                titleLabels={titleLabels}
                                                            />
                                                        </>
                                                    ))}
                                                {activitiesRoutesOrGaps.length === 0 && (
                                                    <>
                                                        <Typography className={classes.label}>
                                                            {t("page.activity-planner.activity-for-day")}
                                                        </Typography>
                                                        <Typography className={classes.date}>
                                                            <h1 className={classes.h1}>
                                                                {formateDateToFrenchFormat(
                                                                    generateDateFromStringInput(
                                                                        surveyDate,
                                                                    ),
                                                                    getLanguage(),
                                                                )}
                                                            </h1>
                                                        </Typography>
                                                    </>
                                                )}
                                            </Box>
                                        </FlexCenter>

                                        {activitiesRoutesOrGaps.length === 0 ? (
                                            <>
                                                <PageIcon
                                                    srcIcon={empty_activity}
                                                    altIcon={t("accessibility.asset.empty-activity-alt")}
                                                />
                                                <FlexCenter>
                                                    <Typography className={cx(classes.label)}>
                                                        {t("page.activity-planner.no-activity")}
                                                    </Typography>
                                                </FlexCenter>
                                                <FlexCenter className={classes.noActivityInfo}>
                                                    <Info {...infoLabels} />
                                                </FlexCenter>
                                            </>
                                        ) : (
                                            <Box className={classes.activityCardsContainer}>
                                                {activitiesRoutesOrGaps.map((activity, index) => (
                                                    <FlexCenter key={uuidv4()}>
                                                        <ActivityOrRouteCard
                                                            labelledBy={""}
                                                            describedBy={""}
                                                            onClick={navToCard(
                                                                activity.iteration || 0,
                                                                activity.isRoute,
                                                            )}
                                                            onClickGap={onOpenAddActivityOrRoute}
                                                            activityOrRoute={activity}
                                                            onEdit={onEditActivity(
                                                                activity.iteration || 0,
                                                                activity,
                                                            )}
                                                            onDelete={onDeleteActivity(
                                                                idSurvey,
                                                                source,
                                                                activity.iteration ?? 0,
                                                            )}
                                                            tabIndex={index + 51}
                                                            modifiable={modifiable}
                                                        />
                                                    </FlexCenter>
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </SurveyPage>

                        <AddActivityOrRoute
                            labelledBy={""}
                            describedBy={""}
                            onClickActivity={addActivityOrRoute(idSurvey, false)}
                            onClickRoute={addActivityOrRoute(idSurvey, true)}
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
                            source: source,
                            data: getData(idSurvey),
                            idSurvey: idSurvey,
                            surveyRootPage: context.surveyRootPage,
                            isRoute: isRoute,
                            activityOrRoute: activityOrRoute,
                            rightsSurvey: getSurveyRights(idSurvey ?? ""),
                        }}
                    />
                </Box>
            </Box>
        </>
    );
};

const useStyles = makeStylesEdt<{ isIOS: boolean; modifiable: boolean; isOpen: boolean }>({
    "name": { ActivityOrRoutePlannerPage },
})((theme, { isIOS, modifiable, isOpen }) => ({
    snackbar: {
        bottom: "90px !important",
        "& .MuiSnackbarContent-root": {
            backgroundColor: theme.palette.error.light,
            color: theme.variables.alertActivity,
        },
    },
    infoBox: {
        width: "350px",
        padding: "1rem 0.25rem 0.5rem 2rem",
        marginBottom: "1rem",
    },
    infoReviewerBox: {
        width: "100%",
        padding: "1rem 0.25rem 0.5rem 2rem",
        marginBottom: "1rem",
    },
    label: {
        fontSize: "14px",
    },
    labelLock: {
        color: !modifiable ? "rgba(0, 0, 0, 0.38)" : "",
    },
    date: {
        fontSize: "18px",
        fontWeight: "bold",
    },
    surveyPageBox: {
        flexGrow: "1",
        display: "flex",
        alignItems: "flex-start",
        overflow: "auto",
        height: "100vh",
        maxHeight: "100vh",
    },
    surveyPageBoxTablet: {
        height: "100vh",
        maxHeight: isIOS ? (isOpen ? "80vh" : "87vh") : "94vh",
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
        marginBottom: "6rem",
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
    fullHeightNav: {
        display: "flex",
        justifyContent: "center",
        flexGrow: "1",
    },
    noActivityInfo: {
        marginTop: "1rem",
    },
    h1: {
        fontSize: "18px",
        margin: 0,
        lineHeight: "1.5rem",
        fontWeight: "bold",
    },
    headerActivityLockBox: {
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
    },
    headerActivityBox: {
        flexDirection: "column",
    },
    headerLockBox: {
        display: "flex",
        alignItems: "center",
    },
}));

export default ActivityOrRoutePlannerPage;
