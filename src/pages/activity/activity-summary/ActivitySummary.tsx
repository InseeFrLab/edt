import {
    formateDateToFrenchFormat,
    generateDateFromStringInput,
    Info,
    makeStylesEdt,
} from "@inseefrlab/lunatic-edt";
import { Box, Button, Divider, Typography } from "@mui/material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InfoAlertIcon from "assets/illustration/info-alert.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import ActivityOrRouteCard from "components/edt/ActivityCard/ActivityOrRouteCard";
import AddActivityOrRoute from "components/edt/AddActivityOrRoute/AddActivityOrRoute";
import DayCharacteristics from "components/edt/DayCharacteristic/DayCharacteristic";
import DaySummary from "components/edt/DaySummary/DaySummary";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { LocalStorageVariableEnum } from "enumerations/LocalStorageVariableEnum";
import { LoopEnum } from "enumerations/LoopEnum";
import { ActivitiesSummaryExportData } from "interface/entity/ActivitiesSummary";
import { LunaticModel, OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder } from "orchestrator/Orchestrator";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getLocalStorageValue } from "service/local-storage-service";
import { getLoopSize, setLoopSize } from "service/loop-service";
import {
    getCurrentNavigatePath,
    getOrchestratorPage,
    navToActivityRoutePlanner,
    navToEditActivity,
    navToHelp,
    navToHome,
    setEnviro,
} from "service/navigation-service";
import { getLanguage } from "service/referentiel-service";
import { getUserActivitiesCharacteristics, getUserActivitiesSummary } from "service/summary-service";
import { deleteActivity, getActivitiesOrRoutes, getScore } from "service/survey-activity-service";
import {
    getFullFrenchDate,
    getPrintedFirstName,
    getSurveyDate,
    getValue,
    saveData,
    setValue,
} from "service/survey-service";
import ActivitiesSummaryExportTemplate from "template/summary-export/ActivitiesSummaryExportTemplate";
import { v4 as uuidv4 } from "uuid";

const ActivitySummaryPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const navigate = useNavigate();
    setEnviro(context, useNavigate(), callbackHolder);
    const { classes } = useStyles();
    const { t } = useTranslation();
    const [score, setScore] = React.useState<number | undefined>(undefined);
    const [isAddActivityOrRouteOpen, setIsAddActivityOrRouteOpen] = React.useState(false);
    const localIsSummaryEdited = getLocalStorageValue(
        context.idSurvey,
        LocalStorageVariableEnum.IS_EDITED_SUMMARY,
    );
    const [isSummaryEdited, setIsSummaryEdited] = React.useState<boolean>(
        localIsSummaryEdited == "true",
    );

    let contextIteration = 0;
    const { activitiesRoutesOrGaps } = getActivitiesOrRoutes(t, context.idSurvey, context.source);
    const surveyDate = getSurveyDate(context.idSurvey) || "";
    const userActivitiesCharacteristics = getUserActivitiesCharacteristics(context.idSurvey, t);
    const userActivitiesSummary = getUserActivitiesSummary(context.idSurvey, t);
    const exportData: ActivitiesSummaryExportData = {
        firstName: getValue(context.idSurvey, FieldNameEnum.FIRSTNAME) as string,
        surveyDate: getFullFrenchDate(getValue(context.idSurvey, FieldNameEnum.SURVEYDATE) as string),
        activitiesAndRoutes: activitiesRoutesOrGaps,
        activities: activitiesRoutesOrGaps.filter(activity => !activity.isRoute),
        routes: activitiesRoutesOrGaps.filter(activity => activity.isRoute),
        userActivitiesSummary: userActivitiesSummary,
        userActivitiesCharacteristics: userActivitiesCharacteristics,
    };

    useEffect(() => {
        setScore(getScore(context.idSurvey, t));
    }, [activitiesRoutesOrGaps]);

    const navToCard = useCallback((iteration: number) => () => navToActivityOrRoute(iteration), []);

    const navToActivityOrRoute = (iteration: number): void => {
        const isEditedSummary: { [key: string]: string } = {
            [LocalStorageVariableEnum.IS_EDITED_SUMMARY]: "true",
        };
        localStorage.setItem(context.idSurvey, JSON.stringify(isEditedSummary));
        setIsSummaryEdited(true);
        navigate(
            getCurrentNavigatePath(
                context.idSurvey,
                context.surveyRootPage,
                context.source.maxPage,
                context.source,
                LoopEnum.ACTIVITY_OR_ROUTE,
                iteration,
            ),
        );
        setIsAddActivityOrRouteOpen(false);
    };

    const onEditActivityOrRoute = useCallback((iteration: number) => {
        const isEditedSummary: { [key: string]: string } = {
            [LocalStorageVariableEnum.IS_EDITED_SUMMARY]: "true",
        };
        localStorage.setItem(context.idSurvey, JSON.stringify(isEditedSummary));
        setIsSummaryEdited(true);
        navToEditActivity(iteration);
    }, []);

    const onDeleteActivityOrRoute = useCallback(
        (idSurvey: string, source: LunaticModel, iteration: number) => {
            const isEditedSummary: { [key: string]: string } = {
                [LocalStorageVariableEnum.IS_EDITED_SUMMARY]: "true",
            };
            localStorage.setItem(context.idSurvey, JSON.stringify(isEditedSummary));
            setIsSummaryEdited(true);
            deleteActivity(idSurvey, source, iteration);
            activitiesRoutesOrGaps.splice(iteration);
            navToActivityRoutePlanner();
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

    const onOpenAddActivityOrRoute = useCallback(() => {
        setIsAddActivityOrRouteOpen(true);
    }, []);

    const onCloseAddActivityOrRoute = useCallback(() => {
        setIsAddActivityOrRouteOpen(false);
    }, [isAddActivityOrRouteOpen]);

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
            navToActivityOrRoute(contextIteration);
        });
    };

    const onEditCharacteristics = useCallback(() => {
        navigate(
            getCurrentNavigatePath(
                context.idSurvey,
                context.surveyRootPage,
                getOrchestratorPage(EdtRoutesNameEnum.GREATEST_ACTIVITY_DAY, EdtRoutesNameEnum.ACTIVITY),
                context.source,
            ),
        );
    }, []);

    return (
        <SurveyPage
            onPrevious={navToHome}
            firstName={getPrintedFirstName(context.idSurvey)}
            firstNamePrefix={t("component.survey-page-edit-header.planning-of")}
            onHelp={navToHelp}
            activityProgressBar={true}
            idSurvey={context.idSurvey}
            score={score}
        >
            <FlexCenter>
                <Box className={classes.infoBox}>
                    <Typography className={classes.label}>
                        {t("page.activity-planner.activity-for-day")}
                    </Typography>
                    <Typography className={classes.date}>
                        {formateDateToFrenchFormat(
                            generateDateFromStringInput(surveyDate),
                            getLanguage(),
                        )}
                    </Typography>
                </Box>
            </FlexCenter>
            <Box className={classes.activityCardsContainer}>
                {activitiesRoutesOrGaps.map(activity => (
                    <FlexCenter key={uuidv4()}>
                        <ActivityOrRouteCard
                            labelledBy={""}
                            describedBy={""}
                            onClick={navToCard(activity.iteration || 0)}
                            activityOrRoute={activity}
                            onEdit={onEditActivity(activity.iteration || 0)}
                            onDelete={onDeleteActivity(
                                context.idSurvey,
                                context.source,
                                activity.iteration ?? 0,
                            )}
                        />
                    </FlexCenter>
                ))}
            </Box>
            <FlexCenter className={classes.addActivityOrRouteButtonBox}>
                <Button variant="contained" onClick={onOpenAddActivityOrRoute}>
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
                />
                <DaySummary userActivitiesSummary={userActivitiesSummary} />
            </Box>
            <FlexCenter className={classes.download}>
                <Button variant="contained" className={classes.downloadButton}>
                    <PDFDownloadLink
                        className={classes.downloadLink}
                        document={<ActivitiesSummaryExportTemplate exportData={exportData} />}
                        fileName={
                            t("export.activities-summary.file-name") +
                            getValue(context.idSurvey, FieldNameEnum.FIRSTNAME) +
                            "_" +
                            getValue(context.idSurvey, FieldNameEnum.SURVEYDATE) +
                            ".pdf"
                        }
                    >
                        {() => t("page.activity-summary.download-pdf")}
                    </PDFDownloadLink>
                </Button>
            </FlexCenter>
            <AddActivityOrRoute
                labelledBy={""}
                describedBy={""}
                onClickActivity={useCallback(() => onAddActivityOrRoute(false), [])}
                onClickRoute={useCallback(() => onAddActivityOrRoute(true), [])}
                handleClose={onCloseAddActivityOrRoute}
                open={isAddActivityOrRouteOpen}
            />
        </SurveyPage>
    );
};

const useStyles = makeStylesEdt({ "name": { ActivitySummaryPage } })(theme => ({
    infoBox: {
        width: "350px",
        padding: "1rem 0.25rem 0.5rem 1rem",
        marginBottom: "1rem",
    },
    tooltipBox: {
        color: theme.palette.error.main + " !important",
    },
    label: {
        fontSize: "14px",
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
}));

export default ActivitySummaryPage;
