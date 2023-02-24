import DownloadIcon from "@mui/icons-material/Download";
import { Box, Button, Divider, Typography } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import ActivityOrRouteCard from "components/edt/ActivityCard/ActivityOrRouteCard";
import DayCharacteristics from "components/edt/DayCharacteristic/DayCharacteristic";
import DaySummary from "components/edt/DaySummary/DaySummary";
import { LoopEnum } from "enumerations/LoopEnum";
import { ActivityRouteOrGap } from "interface/entity/ActivityRouteOrGap";
import { LunaticModel, OrchestratorContext } from "interface/lunatic/Lunatic";
import { formateDateToFrenchFormat, generateDateFromStringInput, makeStylesEdt } from "lunatic-edt";
import { callbackHolder } from "orchestrator/Orchestrator";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    getCurrentNavigatePath,
    navToActivityRoutePlanner,
    navToEditActivity,
    navToHelp,
    navToHome,
    setEnviro,
} from "service/navigation-service";
import { getLanguage } from "service/referentiel-service";
import { getUserActivitiesCharacteristics, getUserActivitiesSummary } from "service/summary-service";
import { deleteActivity, getActivitiesOrRoutes, getScore } from "service/survey-activity-service";
import { getPrintedFirstName, getSurveyDate } from "service/survey-service";
import { v4 as uuidv4 } from "uuid";

const ActivitySummaryPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const navigate = useNavigate();
    setEnviro(context, useNavigate(), callbackHolder);
    const { classes } = useStyles();
    const { t } = useTranslation();
    const [, setActivityOrRoute] = React.useState<ActivityRouteOrGap | undefined>(undefined);
    const [, setIsRoute] = React.useState(false);
    const [score, setScore] = React.useState<number | undefined>(undefined);

    const { activitiesRoutesOrGaps } = getActivitiesOrRoutes(t, context.idSurvey, context.source);
    const surveyDate = getSurveyDate(context.idSurvey) || "";
    const userActivitiesCharacteristics = getUserActivitiesCharacteristics(context.idSurvey, t);
    const userActivitiesSummary = getUserActivitiesSummary(context.idSurvey, t);

    useEffect(() => {
        setScore(getScore(context.idSurvey, t));
    }, [activitiesRoutesOrGaps]);

    const navToCard = useCallback(
        (iteration: number, isRoute?: boolean) => () => navToActivityOrRoute(iteration, isRoute),
        [],
    );

    const navToActivityOrRoute = (iteration: number, isItRoute?: boolean): void => {
        setIsRoute(isItRoute ? true : false);
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
    };

    const onEditActivityOrRoute = useCallback((iteration: number, activity: ActivityRouteOrGap) => {
        setActivityOrRoute(activity);
        navToEditActivity(iteration);
    }, []);

    const onDeleteActivityOrRoute = useCallback(
        (idSurvey: string, source: LunaticModel, iteration: number) => {
            deleteActivity(idSurvey, source, iteration);
            activitiesRoutesOrGaps.splice(iteration);
            navToActivityRoutePlanner();
        },
        [],
    );

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

    const onDownloadPdf = useCallback(() => {
        //TODO: export pdf
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
                            onClick={navToCard(activity.iteration || 0, activity.isRoute)}
                            activityOrRoute={activity}
                            onEdit={onEditActivity(activity.iteration || 0, activity)}
                            onDelete={onDeleteActivity(
                                context.idSurvey,
                                context.source,
                                activity.iteration ?? 0,
                            )}
                        />
                    </FlexCenter>
                ))}
            </Box>
            <Divider variant="middle" flexItem />
            <Box className={classes.summaryBox}>
                <DayCharacteristics userActivitiesCharacteristics={userActivitiesCharacteristics} />
                <DaySummary userActivitiesSummary={userActivitiesSummary} />
            </Box>
            <FlexCenter className={classes.download}>
                <Button variant="contained" onClick={onDownloadPdf} endIcon={<DownloadIcon />}>
                    {t("page.activity-summary.download-pdf")}
                </Button>
            </FlexCenter>
        </SurveyPage>
    );
};

const useStyles = makeStylesEdt({ "name": { ActivitySummaryPage } })(() => ({
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
}));

export default ActivitySummaryPage;
