import {
    Alert,
    formateDateToFrenchFormat,
    generateDateFromStringInput,
    Info,
    InfoProps,
    makeStylesEdt,
    TooltipInfo,
} from "@inseefrlab/lunatic-edt";
import { Box, Button, Divider, Switch, Typography } from "@mui/material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { default as errorIcon } from "assets/illustration/error/activity.svg";
import InfoAlertIcon from "assets/illustration/info-alert.svg";
import InfoIcon from "assets/illustration/info.svg";
import checkIcon from "assets/illustration/mui-icon/check.svg";
import downloadIcon from "assets/illustration/mui-icon/download.svg";
import InfoTooltipIcon from "assets/illustration/mui-icon/info.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import ActivityOrRouteCard from "components/edt/ActivityCard/ActivityOrRouteCard";
import AddActivityOrRoute from "components/edt/AddActivityOrRoute/AddActivityOrRoute";
import DayCharacteristics from "components/edt/DayCharacteristic/DayCharacteristic";
import DaySummary from "components/edt/DaySummary/DaySummary";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { EdtUserRightsEnum } from "enumerations/EdtUserRightsEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { LocalStorageVariableEnum } from "enumerations/LocalStorageVariableEnum";
import { LoopEnum } from "enumerations/LoopEnum";
import { SourcesEnum } from "enumerations/SourcesEnum";
import { ActivitiesSummaryExportData } from "interface/entity/ActivitiesSummary";
import { LunaticModel, OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder } from "orchestrator/Orchestrator";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getFlatLocalStorageValue, getLocalStorageValue } from "service/local-storage-service";
import { getLoopSize, setLoopSize } from "service/loop-service";
import {
    getCurrentNavigatePath,
    getLoopParameterizedNavigatePath,
    getNavigatePath,
    getOrchestratorPage,
    navToActivityOrPlannerOrSummary,
    navToEditActivity,
    navToHelp,
    navToHome,
    saveAndNav,
    setEnviro,
} from "service/navigation-service";
import { getLanguage } from "service/referentiel-service";
import { getUserActivitiesCharacteristics, getUserActivitiesSummary } from "service/summary-service";
import {
    deleteActivity,
    getActivitiesOrRoutes,
    getScore,
    surveyReadOnly,
} from "service/survey-activity-service";
import {
    getFullFrenchDate,
    getPrintedFirstName,
    getSource,
    getSurveyDate,
    getValue,
    lockSurvey,
    saveData,
    setValue,
    surveyLocked,
    validateSurvey,
} from "service/survey-service";
import { getUserRights } from "service/user-service";
import ActivitiesSummaryExportTemplate from "template/summary-export/ActivitiesSummaryExportTemplate";
import { v4 as uuidv4 } from "uuid";

const ActivitySummaryPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const navigate = useNavigate();
    setEnviro(context, useNavigate(), callbackHolder);

    const { t } = useTranslation();

    const source =
        context?.source?.components != null ? context.source : getSource(SourcesEnum.ACTIVITY_SURVEY);
    const idSurveyPath = location.pathname.split("activity/")[1].split("/")[0];
    let idSurvey = context.idSurvey != idSurveyPath ? idSurveyPath : context.idSurvey;

    const [score, setScore] = React.useState<number | undefined>(undefined);
    const [isAddActivityOrRouteOpen, setIsAddActivityOrRouteOpen] = React.useState(false);
    const localIsSummaryEdited = getLocalStorageValue(
        idSurvey,
        LocalStorageVariableEnum.IS_EDITED_SUMMARY,
    );
    const [isSummaryEdited, setIsSummaryEdited] = React.useState<boolean>(
        localIsSummaryEdited == "true",
    );

    let contextIteration = 0;
    const [addActivityOrRouteFromGap, setAddActivityOrRouteFromGap] = React.useState(false);
    const [gapStartTime, setGapStartTime] = React.useState<string>();
    const [gapEndTime, setGapEndTime] = React.useState<string>();

    const { activitiesRoutesOrGaps } = getActivitiesOrRoutes(t, idSurvey, context.source);
    const surveyDate = getSurveyDate(idSurvey) || "";
    const userActivitiesCharacteristics = getUserActivitiesCharacteristics(idSurvey, t);
    const userActivitiesSummary = getUserActivitiesSummary(idSurvey, t);
    const exportData: ActivitiesSummaryExportData = {
        houseReference: context.data.houseReference || "",
        firstName: getValue(idSurvey, FieldNameEnum.FIRSTNAME) as string,
        surveyDate: getFullFrenchDate(getValue(idSurvey, FieldNameEnum.SURVEYDATE) as string),
        activitiesAndRoutes: activitiesRoutesOrGaps,
        activities: activitiesRoutesOrGaps.filter(activity => !activity.isRoute),
        routes: activitiesRoutesOrGaps.filter(activity => activity.isRoute),
        userActivitiesSummary: userActivitiesSummary,
        userActivitiesCharacteristics: userActivitiesCharacteristics,
    };

    const modifiable = !surveyReadOnly(context.rightsSurvey);
    const { classes } = useStyles({ "modifiable": modifiable });

    useEffect(() => {
        setScore(getScore(idSurvey, t));
    }, [activitiesRoutesOrGaps]);

    useEffect(() => {
        //The loop have to have a default size in source but it's updated depending on the data array size
        setLoopSize(
            context.source,
            LoopEnum.ACTIVITY_OR_ROUTE,
            getLoopSize(idSurvey, LoopEnum.ACTIVITY_OR_ROUTE),
        );
    }, []);

    useEffect(() => {
        idSurvey = context.idSurvey != idSurveyPath ? idSurveyPath : context.idSurvey;
        context.idSurvey = idSurvey;
    });

    const navToCard = useCallback((iteration: number) => () => navToActivityOrRoute(iteration), []);

    const navToActivityOrRoute = (iteration: number): void => {
        const isEditedSummary: { [key: string]: string } = {
            [LocalStorageVariableEnum.IS_EDITED_SUMMARY]: "true",
        };
        localStorage.setItem(idSurvey, JSON.stringify(isEditedSummary));
        setIsSummaryEdited(true);
        navigate(
            getCurrentNavigatePath(
                idSurvey,
                context.surveyRootPage,
                context.source.maxPage,
                context.source,
                LoopEnum.ACTIVITY_OR_ROUTE,
                iteration,
            ),
        );
        setIsAddActivityOrRouteOpen(false);
    };

    const onEditActivityOrRoute = useCallback(
        (iteration: number) => {
            const isEditedSummary: { [key: string]: string } = {
                [LocalStorageVariableEnum.IS_EDITED_SUMMARY]: "true",
            };
            localStorage.setItem(idSurvey, JSON.stringify(isEditedSummary));
            setIsSummaryEdited(true);
            navToEditActivity(iteration);
        },
        [idSurvey],
    );

    const onDeleteActivityOrRoute = useCallback(
        (idSurvey: string, source: LunaticModel, iteration: number) => {
            const isEditedSummary: { [key: string]: string } = {
                [LocalStorageVariableEnum.IS_EDITED_SUMMARY]: "true",
            };
            localStorage.setItem(idSurvey, JSON.stringify(isEditedSummary));
            setIsSummaryEdited(true);
            deleteActivity(idSurvey, source, iteration);
            activitiesRoutesOrGaps.splice(iteration);
            navToActivityOrPlannerOrSummary(idSurvey, source.maxPage, navigate, source);
        },
        [],
    );

    const onEditActivity = useCallback(
        (iteration: number) => () => onEditActivityOrRoute(iteration),
        [],
    );

    const onDeleteActivity = useCallback(
        (idSurvey: string, source: LunaticModel, iteration: number) => () =>
            onDeleteActivityOrRoute(idSurvey, source, iteration),
        [],
    );

    const onOpenAddActivityOrRoute = useCallback(
        (event: any, startTime?: string, endTime?: string) => {
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
    }, [isAddActivityOrRouteOpen, addActivityOrRouteFromGap]);

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
        saveData(idSurvey, updatedData || {}).then(() => {
            onCloseAddActivityOrRoute();
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

    const onAddActivityOrRoute = (idSurvey: string, isRouteBool: boolean) => {
        const loopSize = setLoopSize(
            context.source,
            LoopEnum.ACTIVITY_OR_ROUTE,
            getLoopSize(idSurvey, LoopEnum.ACTIVITY_OR_ROUTE) + 1,
        );
        contextIteration = loopSize - 1;
        const routeData = setValue(idSurvey, FieldNameEnum.ISROUTE, isRouteBool, contextIteration);
        saveData(idSurvey, routeData || {}).then(() => {
            navToActivityOrRoute(contextIteration);
        });
    };

    const onAddActivity = useCallback(
        (idSurvey: string, isRoute: boolean) => () => onAddActivityOrRoute(idSurvey, isRoute),
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

    const onEditCharacteristics = useCallback(() => {
        navigate(
            getCurrentNavigatePath(
                idSurvey,
                context.surveyRootPage,
                getOrchestratorPage(EdtRoutesNameEnum.GREATEST_ACTIVITY_DAY, EdtRoutesNameEnum.ACTIVITY),
                context.source,
            ),
        );
    }, []);

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

    const [isAlertLockDisplayed, setIsAlertLockDisplayed] = useState<boolean>(false);
    const [isAlertValidateDisplayed, setIsAlertValidateDisplayed] = useState<boolean>(false);
    const [isLocked, setIsLocked] = useState<boolean>(surveyLocked(idSurvey));

    const alertLockLabels = {
        boldContent: isLocked
            ? t("page.reviewer-home.lock-popup.boldContent-not-locked")
            : t("page.reviewer-home.lock-popup.boldContent"),
        content: isLocked
            ? t("page.reviewer-home.lock-popup.content-not-locked")
            : t("page.reviewer-home.lock-popup.content"),
        cancel: t("page.alert-when-quit.alert-cancel"),
        complete: isLocked
            ? t("page.reviewer-home.not-lock-survey")
            : t("page.reviewer-home.lock-survey"),
    };

    const lock = useCallback(() => {
        lockSurvey(idSurvey).then((locked: any) => {
            setIsLocked(locked);
            setIsAlertLockDisplayed(false);
        });
    }, [idSurvey]);

    const lockActivity = useCallback(() => setIsAlertLockDisplayed(true), []);

    const alertValidateLabels = {
        boldContent: t("page.reviewer-home.validate-popup.boldContent"),
        content: "",
        cancel: t("page.alert-when-quit.alert-cancel"),
        complete: t("page.reviewer-home.validate-survey"),
    };

    const validate = useCallback(() => {
        validateSurvey(idSurvey).then(() => {
            setIsAlertValidateDisplayed(false);
            navigate(getNavigatePath(EdtRoutesNameEnum.SURVEYED_HOME));
        });
    }, [idSurvey]);

    const openPopup = useCallback(() => {
        setIsAlertValidateDisplayed(true);
    }, []);

    const back = useCallback(() => {
        saveAndNav();
    }, []);

    const isDemoMode = getFlatLocalStorageValue(LocalStorageVariableEnum.IS_DEMO_MODE) === "true";
    const isReviewer = getUserRights() === EdtUserRightsEnum.REVIEWER;
    const isReviewerMode = isReviewer && !isDemoMode;

    return (
        <SurveyPage
            onPrevious={navToHome}
            firstName={getPrintedFirstName(idSurvey)}
            firstNamePrefix={t("component.survey-page-edit-header.planning-of")}
            onHelp={navToHelp}
            activityProgressBar={true}
            idSurvey={idSurvey}
            score={score}
            modifiable={modifiable}
        >
            <FlexCenter>
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
                                        isAlertDisplayed={isAlertLockDisplayed}
                                        onCompleteCallBack={lock}
                                        onCancelCallBack={displayAlert(setIsAlertLockDisplayed, false)}
                                        labels={alertLockLabels}
                                        icon={errorIcon}
                                        errorIconAlt={t("page.alert-when-quit.alt-alert-icon")}
                                    ></Alert>
                                </>
                                <Box className={classes.headerActivityBox}>
                                    <Typography className={classes.label}>
                                        {t("page.activity-planner.activity-for-day")}
                                    </Typography>
                                    <TooltipInfo infoLabels={infoLabels} titleLabels={titleLabels} />
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
                                <TooltipInfo infoLabels={infoLabels} titleLabels={titleLabels} />
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
                                        generateDateFromStringInput(surveyDate),
                                        getLanguage(),
                                    )}
                                </h1>
                            </Typography>
                        </>
                    )}
                </Box>
            </FlexCenter>
            <Box className={classes.activityCardsContainer}>
                {activitiesRoutesOrGaps.map((activity, index) => (
                    <FlexCenter key={uuidv4()}>
                        <ActivityOrRouteCard
                            labelledBy={""}
                            describedBy={""}
                            onClick={navToCard(activity.iteration || 0)}
                            onClickGap={onOpenAddActivityOrRoute}
                            activityOrRoute={activity}
                            onEdit={onEditActivity(activity.iteration || 0)}
                            onDelete={onDeleteActivity(
                                idSurvey,
                                context.source,
                                activity.iteration ?? 0,
                            )}
                            tabIndex={index + 51}
                            modifiable={modifiable}
                        />
                    </FlexCenter>
                ))}
            </Box>
            <FlexCenter className={classes.addActivityOrRouteButtonBox}>
                <Button variant="contained" onClick={onOpenAddActivityOrRoute} disabled={!modifiable}>
                    {t("page.activity-summary.add-activity-or-route")}
                </Button>
            </FlexCenter>
            <Divider variant="middle" flexItem />
            {isSummaryEdited ? (
                <FlexCenter>
                    <Box className={classes.tooltipBox}>
                        <Info
                            boldText={t("page.activity-summary.alert-tooltip-edit.alert-bold")}
                            isAlertInfo={true}
                            infoIconAlt={t("accessibility.asset.info.info-alt")}
                            infoIcon={InfoAlertIcon}
                            border={true}
                        />
                    </Box>
                </FlexCenter>
            ) : (
                <></>
            )}
            <Box className={classes.summaryBox}>
                <DayCharacteristics
                    userActivitiesCharacteristics={userActivitiesCharacteristics}
                    onEdit={onEditCharacteristics}
                    modifiable={modifiable}
                />
                <DaySummary userActivitiesSummary={userActivitiesSummary} />
            </Box>
            <FlexCenter className={classes.download}>
                {isReviewerMode ? (
                    <>
                        <Alert
                            isAlertDisplayed={isAlertValidateDisplayed}
                            onCompleteCallBack={validate}
                            onCancelCallBack={displayAlert(setIsAlertValidateDisplayed, false)}
                            labels={alertValidateLabels}
                            icon={errorIcon}
                            errorIconAlt={t("page.alert-when-quit.alt-alert-icon")}
                        ></Alert>
                        <Button variant="outlined" onClick={back} className={classes.buttonNav}>
                            {t("common.navigation.back")}
                        </Button>
                        <Button
                            variant="outlined"
                            className={classes.buttonNav}
                            startIcon={
                                <img
                                    src={downloadIcon}
                                    alt={t("accessibility.asset.mui-icon.download")}
                                    className={classes.midSizeButton}
                                />
                            }
                        >
                            <PDFDownloadLink
                                className={classes.downloadLinkReviewer}
                                document={<ActivitiesSummaryExportTemplate exportData={exportData} />}
                                fileName={
                                    t("export.activities-summary.file-name") +
                                    getValue(idSurvey, FieldNameEnum.FIRSTNAME) +
                                    "_" +
                                    getValue(idSurvey, FieldNameEnum.SURVEYDATE) +
                                    ".pdf"
                                }
                            >
                                {() => t("page.activity-summary.download-pdf")}
                            </PDFDownloadLink>
                        </Button>
                        <Button
                            variant="contained"
                            onClick={openPopup}
                            disabled={!modifiable}
                            startIcon={
                                <img
                                    src={checkIcon}
                                    alt={t("accessibility.asset.mui-icon.check")}
                                    className={classes.midSizeButton}
                                />
                            }
                        >
                            {t("page.reviewer-home.validate-survey")}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="contained" className={classes.downloadButton}>
                            <PDFDownloadLink
                                className={classes.downloadLink}
                                document={<ActivitiesSummaryExportTemplate exportData={exportData} />}
                                fileName={
                                    t("export.activities-summary.file-name") +
                                    getValue(idSurvey, FieldNameEnum.FIRSTNAME) +
                                    "_" +
                                    getValue(idSurvey, FieldNameEnum.SURVEYDATE) +
                                    ".pdf"
                                }
                            >
                                {() => t("page.activity-summary.download-pdf")}
                            </PDFDownloadLink>
                        </Button>
                    </>
                )}
            </FlexCenter>

            <AddActivityOrRoute
                labelledBy={""}
                describedBy={""}
                onClickActivity={addActivityOrRoute(idSurvey, false)}
                onClickRoute={addActivityOrRoute(idSurvey, true)}
                handleClose={onCloseAddActivityOrRoute}
                open={isAddActivityOrRouteOpen}
            />
        </SurveyPage>
    );
};

const useStyles = makeStylesEdt<{ modifiable: boolean }>({ "name": { ActivitySummaryPage } })(
    (theme, { modifiable }) => ({
        infoBox: {
            width: "350px",
            padding: "1rem 0.25rem 0.5rem 1rem",
            marginBottom: "1rem",
        },
        infoReviewerBox: {
            width: "100vh",
            padding: "1rem 0.25rem 0.5rem 2rem",
            marginBottom: "1rem",
        },
        tooltipBox: {
            color: theme.palette.error.main + " !important",
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
        addActivityOrRouteButtonBox: {
            marginBottom: "1rem",
        },
        activityCardsContainer: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, max-content))",
            gridGap: "1rem",
            justifyContent: "center",
            padding: "initial",
            marginBottom: "1rem",
        },
        summaryBox: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, max-content))",
            gridGap: "1rem",
            justifyContent: "center",
            padding: "initial",
            marginBottom: "1rem",
        },
        download: {
            marginBottom: "6rem",
        },
        downloadButton: {
            padding: 0,
        },
        downloadLink: {
            textDecoration: "none",
            color: theme.variables.white,
            padding: "6px 6px",
        },
        downloadLinkReviewer: {
            textDecoration: "none",
            color: theme.palette.primary.main,
            padding: "6px 6px",
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
        buttonNav: {
            marginRight: "1rem",
        },
        midSizeButton: {
            height: "24px",
        },
    }),
);

export default ActivitySummaryPage;
