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
import { ReactComponent as EmptyActivityImg } from "assets/illustration/empty-activity.svg";
import { ReactComponent as ErrorIcon } from "assets/illustration/error/activity.svg";
import { ReactComponent as InfoIcon } from "assets/illustration/info.svg";
import { ReactComponent as CloseIcon } from "assets/illustration/mui-icon/close.svg";
import { ReactComponent as InfoTooltipIcon } from "assets/illustration/mui-icon/info.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoadingFull from "components/commons/LoadingFull/LoadingFull";
import PageIcon from "components/commons/PageIcon/PageIcon";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import ActivityOrRouteCard from "components/edt/ActivityCard/ActivityOrRouteCard";
import AddActivityOrRoute from "components/edt/AddActivityOrRoute/AddActivityOrRoute";
import HelpMenu from "components/edt/HelpMenu/HelpMenu";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { LoopEnum } from "enumerations/LoopEnum";
import { SourcesEnum } from "enumerations/SourcesEnum";
import { ActivityRouteOrGap } from "interface/entity/ActivityRouteOrGap";
import { LunaticData, LunaticModel, OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder } from "orchestrator/Orchestrator";
import ErrorPage from "pages/error/ErrorPage";
import React, { useCallback, useEffect, useState } from "react";
import { isAndroid, isIOS, isMobile } from "react-device-detect";
import { TFunction, useTranslation } from "react-i18next";
import {
    Location,
    NavigateFunction,
    Outlet,
    useLocation,
    useNavigate,
    useOutletContext,
} from "react-router-dom";
import { getLoopSize, setLoopSize } from "service/loop-service";
import {
    getCurrentNavigatePath,
    getLoopParameterizedNavigatePath,
    getNavigatePath,
    getOrchestratorPage,
    navFullPath,
    navToActivityRoutePlanner,
    navToEditActivity,
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
    refreshSurvey,
    saveData,
    setValue,
} from "service/survey-service";
import { isDemoMode, isSurveyLocked, lockSurvey } from "service/survey-state-service";
import { isReviewer } from "service/user-service";
import { getClassCondition, getSurveyIdFromUrl } from "utils/utils";
import { v4 as uuidv4 } from "uuid";

const getSurveyDatePlanner = (idSurvey: string) => {
    return getSurveyDate(idSurvey) ?? "";
};

const propsUseStyles = (context: OrchestratorContext, modifiable: boolean) => {
    return {
        "isIOS": isIOS,
        "modifiable": modifiable,
        "iosHeight": context.isOpenHeader ? "80vh" : "87vh",
        "innerHeight": window.innerHeight,
    };
};

const getAlertUnlockLabels = (variableEdited: boolean, t: TFunction<"translation", undefined>) => {
    return {
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
};

const isChildDisplayed = (path: string): boolean => {
    return path?.split(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER)[1]?.length > 0;
};

const isActivity = (location: Location) => {
    return (
        location.pathname?.split("/")[3] == EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER &&
        location.pathname?.split("/")[4] == null
    );
};

const setAlertSnackbar = (
    setSnackbarText: (value: React.SetStateAction<string | undefined>) => void,
    setOpenSnackbar: (value: React.SetStateAction<boolean>) => void,
    skip: boolean,
    haveOverlaps: boolean,
    overlaps: {
        prev: string | undefined;
        current: string | undefined;
    }[],
    t: TFunction<"translation", undefined>,
) => {
    if (haveOverlaps) {
        setSnackbarText(
            t("page.activity-planner.start-alert") +
                overlaps
                    .map(o => o?.prev?.concat(t("page.activity-planner.and"), o?.current ?? ""))
                    .join(", ") +
                t("page.activity-planner.end-alert"),
        );
        if (!skip) setOpenSnackbar(true);
    }
};

const setValueOrNull = (
    idSurvey: string,
    variableName: FieldNameEnum,
    value: string | boolean | undefined,
    iteration: number | undefined,
) => {
    setValue(idSurvey, variableName, value ?? null, iteration);
};

const onFinish = (
    closed: boolean,
    idSurvey: string,
    setIsAlertDisplayed: React.Dispatch<React.SetStateAction<boolean>>,
    callbackHolder: {
        getData(): LunaticData;
        getErrors(): {
            [key: string]: [];
        };
    },
    navigate: NavigateFunction,
    context: OrchestratorContext,
    source: LunaticModel,
) => {
    if (closed) {
        const data = setValue(idSurvey, FieldNameEnum.ISCLOSED, true);
        saveData(idSurvey, data ?? callbackHolder.getData(), false, true).then(() => {
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

const getSourceContext = (context: OrchestratorContext) => {
    return context?.source?.components != null ? context.source : getSource(SourcesEnum.ACTIVITY_SURVEY);
};

const addActivityOrRoute = (
    idSurvey: string,
    isRoute: boolean,
    addActivityOrRouteFromGap: boolean,
    gapStartTime: string | undefined,
    gapEndTime: string | undefined,
    onAddActivityGap: (
        idSurvey: string,
        isRoute: boolean,
        startTime?: string,
        endTime?: string,
    ) => () => void,
    onAddActivity: (idSurvey: string, isRoute: boolean) => () => void,
) => {
    return addActivityOrRouteFromGap
        ? onAddActivityGap(idSurvey, isRoute, gapStartTime, gapEndTime)
        : onAddActivity(idSurvey, isRoute);
};

const heightClass = (classes: any) => {
    return isPwa() ? classes.fullHeight : classes.fullHeightNav;
};

const isReviewerMode = () => {
    return isReviewer() && !isDemoMode();
};

const renderPageOrLoadingOrError = (
    initialized: boolean,
    error: ErrorCodeEnum | undefined,
    t: TFunction<"translation", undefined>,
    page: any,
) => {
    if (initialized) {
        return page;
    } else {
        return !error ? (
            <LoadingFull
                message={t("page.home.loading.message")}
                thanking={t("page.home.loading.thanking")}
            />
        ) : (
            <ErrorPage errorCode={error} atInit={true} />
        );
    }
};

const isMobileApp = () => {
    return !isPwa() && isMobile && (isIOS || isAndroid);
};

const isLockedLabels = (
    isLocked: boolean,
    variableEdited: boolean,
    t: TFunction<"translation", undefined>,
) => {
    const alertUnlockLabels = getAlertUnlockLabels(variableEdited, t);

    const alertLockLabels = {
        boldContent: t("page.reviewer-home.lock-popup.boldContent"),
        content: t("page.reviewer-home.lock-popup.content"),
        cancel: t("page.alert-when-quit.alert-cancel"),
        complete: t("page.reviewer-home.lock-survey"),
    };

    return isLocked ? alertUnlockLabels : alertLockLabels;
};

const getIterationOrZero = (activity: ActivityRouteOrGap) => {
    return activity.iteration ?? 0;
};

const displaySnackbar = (
    idSurvey: string,
    source: LunaticModel,
    setters: {
        setSnackbarText: (value: React.SetStateAction<string | undefined>) => void;
        setOpenSnackbar: (value: React.SetStateAction<boolean>) => void;
        setSkip: (value: React.SetStateAction<boolean>) => void;
    },
    skip: boolean,
    overlaps: {
        prev: string | undefined;
        current: string | undefined;
    }[],
    location: Location,
    t: TFunction<"translation", undefined>,
) => {
    const isActivityPlanner = isActivity(location);
    if (isActivityPlanner) {
        const act = getActivitiesOrRoutes(t, idSurvey, source);
        setAlertSnackbar(
            setters.setSnackbarText,
            setters.setOpenSnackbar,
            skip,
            act.overlaps.length > 0,
            overlaps,
            t,
        );
    } else {
        setters.setSkip(false);
    }
};

const openAddActivityOrRoute = (
    startTime: string | undefined,
    endTime: string | undefined,
    setIsAddActivityOrRouteOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setAddActivityOrRouteFromGap: React.Dispatch<React.SetStateAction<boolean>>,
    setGapStartTime: React.Dispatch<React.SetStateAction<string | undefined>>,
    setGapEndTime: React.Dispatch<React.SetStateAction<string | undefined>>,
) => {
    setIsAddActivityOrRouteOpen(true);
    if (startTime && endTime) {
        setAddActivityOrRouteFromGap(true);
        setGapStartTime(startTime);
        setGapEndTime(endTime);
    }
};

const init = (
    idSurvey: string,
    setError: React.Dispatch<React.SetStateAction<ErrorCodeEnum | undefined>>,
    setInitialized: (value: React.SetStateAction<boolean>) => void,
) => {
    if (navigator.onLine && !isDemoMode()) {
        refreshSurvey(idSurvey, setError).finally(() => {
            setInitialized(true);
        });
    } else {
        setInitialized(true);
    }
};

const updateSubChildDisplayed = (
    isSubchildDisplayed: boolean,
    setIsSubChildDisplayed: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    const currentIsChildDisplay = isChildDisplayed(location.pathname);
    if (currentIsChildDisplay !== isSubchildDisplayed) {
        setIsSubChildDisplayed(currentIsChildDisplay);
    }
};

const getAddLabel = (
    activitiesRoutesOrGaps: ActivityRouteOrGap[],
    t: TFunction<"translation", undefined>,
) => {
    return activitiesRoutesOrGaps.length === 0 ? t("common.navigation.add") : undefined;
};

const ActivityOrRoutePlannerPage = () => {
    const navigate = useNavigate();
    const context: OrchestratorContext = useOutletContext();
    const source = getSourceContext(context);

    const location = useLocation();
    let idSurvey = getSurveyIdFromUrl(context, location);
    const { t } = useTranslation();
    const [isSubChildDisplayed, setIsSubChildDisplayed] = React.useState<boolean>(false);
    const [isAddActivityOrRouteOpen, setIsAddActivityOrRouteOpen] = React.useState(false);
    const [isRoute, setIsRoute] = React.useState(false);
    const [addActivityOrRouteFromGap, setAddActivityOrRouteFromGap] = React.useState(false);
    const [gapStartTime, setGapStartTime] = React.useState<string>();
    const [gapEndTime, setGapEndTime] = React.useState<string>();
    const [activityOrRoute, setActivityOrRoute] = React.useState<ActivityRouteOrGap | undefined>(
        undefined,
    );
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [initialized, setInitialized] = React.useState<boolean>(false);
    const [isHelpMenuOpen, setIsHelpMenuOpen] = React.useState(false);

    setEnviro(context, useNavigate(), callbackHolder);
    const isItDesktop = isDesktop();

    let contextIteration = 0;
    const { activitiesRoutesOrGaps, overlaps } = getActivitiesOrRoutes(t, idSurvey, source);
    const [snackbarText, setSnackbarText] = React.useState<string | undefined>(undefined);
    const surveyDate = getSurveyDatePlanner(idSurvey);
    const modifiable = !surveyReadOnly(context.rightsSurvey);

    const { classes, cx } = useStyles(propsUseStyles(context, modifiable));

    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);
    const [skip, setSkip] = useState<boolean>(false);
    const [score, setScore] = React.useState<number | undefined>(undefined);

    const [isAlertLockDisplayed, setIsAlertLockDisplayed] = useState<boolean>(false);
    const [isLocked, setIsLocked] = useState<boolean>(isSurveyLocked(idSurvey));
    const [error, setError] = useState<ErrorCodeEnum | undefined>(undefined);
    const [menuActivityPlannerDisplayed, setMenuActivityPlannerDisplayed] = React.useState(
        isItDesktop && isSubChildDisplayed,
    );

    const alertLabels = {
        boldContent: t("page.alert-when-quit.activity-planner.alert-content-close-bold"),
        content: t("page.alert-when-quit.activity-planner.alert-content-close"),
        cancel: t("page.alert-when-quit.alert-cancel"),
        complete: t("page.alert-when-quit.alert-closed"),
    };

    const variableEdited = existVariableEdited(idSurvey);

    useEffect(() => {
        displaySnackbar(
            idSurvey,
            source,
            {
                setSnackbarText,
                setOpenSnackbar,
                setSkip,
            },
            skip,
            overlaps,
            location,
            t,
        );
        idSurvey = getSurveyIdFromUrl(context, location);
        context.idSurvey = idSurvey;
    });

    useEffect(() => {
        //The loop have to have a default size in source but it's updated depending on the data array size
        setLoopSize(
            source,
            LoopEnum.ACTIVITY_OR_ROUTE,
            getLoopSize(idSurvey, LoopEnum.ACTIVITY_OR_ROUTE),
        );
        setAlertSnackbar(setSnackbarText, setOpenSnackbar, skip, overlaps.length > 0, overlaps, t);
    }, []);

    useEffect(() => {
        updateSubChildDisplayed(isSubChildDisplayed, setIsSubChildDisplayed);
    }, [location]);

    useEffect(() => {
        setMenuActivityPlannerDisplayed(isItDesktop && isSubChildDisplayed);
    }, [isSubChildDisplayed]);

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
        setValueOrNull(idSurvey, FieldNameEnum.START_TIME, startTime, contextIteration);
        setValueOrNull(idSurvey, FieldNameEnum.END_TIME, endTime, contextIteration);
        const updatedData = setValue(idSurvey, FieldNameEnum.ISROUTE, isRouteBool, contextIteration);
        saveData(idSurvey, updatedData).then(() => {
            onCloseAddActivityOrRoute();
            setIsRoute(isRouteBool);
            navigate(
                getLoopParameterizedNavigatePath(
                    idSurvey,
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
            openAddActivityOrRoute(
                startTime,
                endTime,
                setIsAddActivityOrRouteOpen,
                setAddActivityOrRouteFromGap,
                setGapStartTime,
                setGapEndTime,
            );
        },
        [addActivityOrRouteFromGap, gapStartTime, gapEndTime],
    );

    const onCloseAddActivityOrRoute = useCallback(() => {
        setIsAddActivityOrRouteOpen(false);
        setAddActivityOrRouteFromGap(false);
    }, [isAddActivityOrRouteOpen, addActivityOrRouteFromGap]);

    const onEdit = useCallback(() => {
        navFullPath(idSurvey, EdtRoutesNameEnum.EDIT_GLOBAL_INFORMATION, EdtRoutesNameEnum.ACTIVITY);
    }, []);

    const onCloseHelpMenu = useCallback(() => {
        setIsHelpMenuOpen(false);
    }, [isHelpMenuOpen]);

    const navToContactPage = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.CONTACT));
    }, []);

    const navToInstallPage = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.INSTALL));
    }, []);

    const navToHelpPages = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.HELP_ACTIVITY));
    }, []);

    const renderMenuHelp = () => {
        return (
            <HelpMenu
                labelledBy={""}
                describedBy={""}
                onClickContact={navToContactPage}
                onClickInstall={navToInstallPage}
                onClickHelp={navToHelpPages}
                handleClose={onCloseHelpMenu}
                open={isHelpMenuOpen}
            />
        );
    };

    const onHelp = useCallback(() => {
        setIsHelpMenuOpen(true);
    }, []);

    const navToActivityOrRoute = (idSurvey: string, iteration: number, isItRoute?: boolean): void => {
        setIsSubChildDisplayed(true);
        setIsRoute(isItRoute ?? false);
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
        navToEditActivity(idSurvey, iteration);
    }, []);

    const onDeleteActivityOrRoute = useCallback(
        (idSurvey: string, source: LunaticModel, iteration: number) => {
            deleteActivity(idSurvey, source, iteration);
            activitiesRoutesOrGaps.splice(iteration);
            navToActivityRoutePlanner(idSurvey, source);
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
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackBar}>
            <CloseIcon aria-label={t("accessibility.asset.mui-icon.close")} />
        </IconButton>
    );

    const messagesEndRef = React.useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        setScore(getScore(idSurvey, t));
        messagesEndRef.current?.scrollIntoView();
    }, [activitiesRoutesOrGaps]);

    useEffect(() => {
        init(idSurvey, setError, setInitialized);
    }, []);

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
        [idSurvey],
    );

    const onAddActivity = useCallback(
        (idSurvey: string, isRoute: boolean) => () => onAddActivityOrRoute(isRoute, idSurvey),
        [idSurvey],
    );

    const onAddActivityGap = useCallback(
        (idSurvey: string, isRoute: boolean, startTime?: string, endTime?: string) => () =>
            onAddActivityOrRouteFromGap(idSurvey, isRoute, startTime, endTime),
        [idSurvey],
    );

    const navToCard = useCallback(
        (iteration: number, isRoute?: boolean) => () => {
            navToActivityOrRoute(idSurvey, iteration, isRoute);
        },
        [idSurvey],
    );

    const closeActivity = useCallback(
        (closed: boolean, surveyId: string) => () =>
            onFinish(closed, surveyId, setIsAlertDisplayed, callbackHolder, navigate, context, source),
        [],
    );

    const displayAlert = useCallback(
        (setDisplayAlert: React.Dispatch<React.SetStateAction<boolean>>, display: boolean) => () =>
            setDisplayAlert(display),
        [],
    );

    const infoLabels: InfoProps = {
        boldText: t("page.activity-planner.info"),
        infoIcon: <InfoIcon aria-label={t("accessibility.asset.info.info-alt")} />,
        infoIconTooltip: <InfoTooltipIcon aria-label={t("accessibility.asset.info.info-alt")} />,
        border: true,
    };

    const titleLabels = {
        boldTitle: formateDateToFrenchFormat(generateDateFromStringInput(surveyDate), getLanguage()),
        typeTitle: "h1",
    };

    const lock = useCallback(() => {
        lockSurvey(idSurvey).then(() => {
            setIsLocked(true);
            setIsAlertLockDisplayed(false);
        });
    }, [idSurvey]);

    const lockActivity = useCallback(() => setIsAlertLockDisplayed(true), []);

    return renderPageOrLoadingOrError(
        initialized,
        error,
        t,
        <Box
            className={cx(
                classes.surveyPageBox,
                getClassCondition(isMobileApp(), classes.surveyPageBoxTablet, ""),
            )}
        >
            {(isItDesktop || !isSubChildDisplayed) && (
                <Box className={classes.innerSurveyPageBox}>
                    {renderMenuHelp()}
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
                        addLabel={getAddLabel(activitiesRoutesOrGaps, t)}
                        activityProgressBar={true}
                        idSurvey={idSurvey}
                        score={score}
                        modifiable={modifiable}
                    >
                        <Box
                            className={getClassCondition(
                                menuActivityPlannerDisplayed,
                                classes.outerContentBox,
                                heightClass(classes),
                            )}
                        >
                            <Box
                                className={getClassCondition(
                                    menuActivityPlannerDisplayed,
                                    classes.innerContentBox,
                                    heightClass(classes),
                                )}
                            >
                                <Box id="inner-content-scroll" className={classes.innerContentScroll}>
                                    <FlexCenter>
                                        <Alert
                                            isAlertDisplayed={isAlertDisplayed}
                                            onCompleteCallBack={closeActivity(true, idSurvey)}
                                            onCancelCallBack={displayAlert(setIsAlertDisplayed, false)}
                                            labels={alertLabels}
                                            icon={
                                                <ErrorIcon
                                                    aria-label={t("page.alert-when-quit.alt-alert-icon")}
                                                />
                                            }
                                        ></Alert>
                                        <Box
                                            className={getClassCondition(
                                                isReviewerMode() && activitiesRoutesOrGaps.length !== 0,
                                                classes.infoReviewerBox,
                                                classes.infoBox,
                                            )}
                                        >
                                            {activitiesRoutesOrGaps.length !== 0 &&
                                                (isReviewerMode() ? (
                                                    <Box className={classes.headerActivityLockBox}>
                                                        <Alert
                                                            isAlertDisplayed={isAlertLockDisplayed}
                                                            onCompleteCallBack={lock}
                                                            onCancelCallBack={displayAlert(
                                                                setIsAlertLockDisplayed,
                                                                false,
                                                            )}
                                                            labels={isLockedLabels(
                                                                isLocked,
                                                                variableEdited,
                                                                t,
                                                            )}
                                                            icon={
                                                                <ErrorIcon
                                                                    aria-label={t(
                                                                        "page.alert-when-quit.alt-alert-icon",
                                                                    )}
                                                                />
                                                            }
                                                        ></Alert>
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
                                                            <Typography className={classes.labelLock}>
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
                                                            {t("page.activity-planner.activity-for-day")}
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
                                                    <Box className={classes.date}>
                                                        <h1 className={classes.h1}>
                                                            {formateDateToFrenchFormat(
                                                                generateDateFromStringInput(surveyDate),
                                                                getLanguage(),
                                                            )}
                                                        </h1>
                                                    </Box>
                                                </>
                                            )}
                                        </Box>
                                    </FlexCenter>

                                    {activitiesRoutesOrGaps.length === 0 ? (
                                        <>
                                            <PageIcon
                                                icon={
                                                    <EmptyActivityImg
                                                        aria-label={t(
                                                            "accessibility.asset.empty-activity-alt",
                                                        )}
                                                    />
                                                }
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
                                        <>
                                            <Box className={classes.activityCardsContainer}>
                                                {activitiesRoutesOrGaps.map((activity, index) => (
                                                    <FlexCenter key={uuidv4()}>
                                                        <ActivityOrRouteCard
                                                            labelledBy={""}
                                                            describedBy={""}
                                                            onClick={navToCard(
                                                                getIterationOrZero(activity),
                                                                activity.isRoute,
                                                            )}
                                                            onClickGap={onOpenAddActivityOrRoute}
                                                            activityOrRoute={activity}
                                                            onEdit={onEditActivity(
                                                                getIterationOrZero(activity),
                                                                activity,
                                                            )}
                                                            onDelete={onDeleteActivity(
                                                                idSurvey,
                                                                source,
                                                                getIterationOrZero(activity),
                                                            )}
                                                            tabIndex={index + 51}
                                                            modifiable={modifiable}
                                                        />
                                                    </FlexCenter>
                                                ))}
                                            </Box>
                                            <div ref={messagesEndRef} />
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </SurveyPage>

                    <AddActivityOrRoute
                        labelledBy={""}
                        describedBy={""}
                        onClickActivity={addActivityOrRoute(
                            idSurvey,
                            false,
                            addActivityOrRouteFromGap,
                            gapStartTime,
                            gapEndTime,
                            onAddActivityGap,
                            onAddActivity,
                        )}
                        onClickRoute={addActivityOrRoute(
                            idSurvey,
                            true,
                            addActivityOrRouteFromGap,
                            gapStartTime,
                            gapEndTime,
                            onAddActivityGap,
                            onAddActivity,
                        )}
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
                    getClassCondition(isSubChildDisplayed && isItDesktop, classes.outletBoxDesktop, ""),
                    getClassCondition(
                        isSubChildDisplayed && !isItDesktop,
                        classes.outletBoxMobileTablet,
                        "",
                    ),
                )}
            >
                {menuActivityPlannerDisplayed && <Divider orientation="vertical" light />}
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
        </Box>,
    );
};

const useStyles = makeStylesEdt<{
    isIOS: boolean;
    modifiable: boolean;
    iosHeight: string;
    innerHeight: number;
}>({
    "name": { ActivityOrRoutePlannerPage },
})((theme, { isIOS, modifiable, iosHeight }) => ({
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
        height: innerHeight + "px",
        maxHeight: isIOS ? iosHeight : innerHeight + "px",
    },
    outletBoxDesktop: {
        flexGrow: "12",
        display: "flex",
        height: "100%",
        width: "100%",
    },
    outletBoxMobileTablet: {
        flexGrow: "12",
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
