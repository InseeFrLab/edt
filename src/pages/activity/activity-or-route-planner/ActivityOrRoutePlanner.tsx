import { Box, Typography } from "@mui/material";
import empty_activity from "assets/illustration/empty-activity.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PageIcon from "components/commons/PageIcon/PageIcon";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import ActivityCard from "components/edt/ActivityCard/ActivityCard";
import AddActivityOrRoute from "components/edt/AddActivityOrRoute/AddActivityOrRoute";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { formateDateToFrenchFormat, generateDateFromStringInput, makeStylesEdt } from "lunatic-edt";
import { callbackHolder } from "orchestrator/Orchestrator";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopSize, LoopEnum, setLoopSize } from "service/loop-service";
import { getCurrentNavigatePath } from "service/navigation-service";
import { getActivities } from "service/survey-activity-service";
import { getPrintedFirstName, getSurveyDate, saveData } from "service/survey-service";

const ActivityOrRoutePlannerPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const context: OrchestratorContext = useOutletContext();
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const [isSubchildDisplayed, setIsSubChildDisplayed] = React.useState(false);
    const [isAddActivityOrRouteOpen, setIsAddActivityOrRouteOpen] = React.useState(false);
    let contextIteration = 0;

    const activities = getActivities(context.idSurvey);
    const surveyDate = getSurveyDate(context.idSurvey) || "";

    const isChildDisplayed = (path: string): boolean => {
        return path.split(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER)[1].length > 0 ? true : false;
    };

    useEffect(() => {
        //The loop have to have a default size in source but it's updated depending on the data array size
        setLoopSize(context.source, LoopEnum.ACTIVITY, getLoopSize(context.idSurvey, LoopEnum.ACTIVITY));
    }, []);

    useEffect(() => {
        const currentIsChildDisplay = isChildDisplayed(location.pathname);
        if (currentIsChildDisplay !== isSubchildDisplayed) {
            setIsSubChildDisplayed(currentIsChildDisplay);
        }
    }, [location]);

    const saveAndGoHome = (): void => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate("/");
        });
    };

    const onFinish = () => {
        saveAndGoHome();
    };

    const onAddActivity = () => {
        const loopSize = setLoopSize(
            context.source,
            LoopEnum.ACTIVITY,
            getLoopSize(context.idSurvey, LoopEnum.ACTIVITY) + 1,
        );
        contextIteration = loopSize - 1;
        navToActivity(contextIteration);
    };

    const onAddRoute = () => {
        //TODO : check the good path for routes when it will be done
        onAddActivity();
    };

    const onOpenAddActivityOrRoute = () => {
        setIsAddActivityOrRouteOpen(true);
    };

    const onCloseAddActivityOrRoute = () => {
        setIsAddActivityOrRouteOpen(false);
    };

    const navBack = () => {
        saveAndGoHome();
    };

    const onEdit = () => {
        //TODO : sprint 5 edition des données
    };

    const navToActivity = (iteration: number): void => {
        setIsSubChildDisplayed(true);
        navigate(
            getCurrentNavigatePath(
                context.idSurvey,
                context.surveyRootPage,
                context.source.maxPage,
                LoopEnum.ACTIVITY,
                iteration,
            ),
        );
        setIsAddActivityOrRouteOpen(false);
    };

    return (
        <>
            {!isSubchildDisplayed && (
                <>
                    <SurveyPage
                        onNavigateBack={navBack}
                        onEdit={onEdit}
                        firstName={getPrintedFirstName(context.idSurvey)}
                        firstNamePrefix={t("component.survey-page-edit-header.planning-of")}
                        onFinish={onFinish}
                        onAdd={onOpenAddActivityOrRoute}
                        finishLabel={t("common.navigation.finish")}
                        addLabel={activities.length === 0 ? t("common.navigation.add") : undefined}
                    >
                        <FlexCenter>
                            <Box className={classes.infoBox}>
                                <Typography className={classes.label}>
                                    {t("page.activity-planner.activity-for-day")}
                                </Typography>
                                <Typography className={classes.date}>
                                    {formateDateToFrenchFormat(generateDateFromStringInput(surveyDate))}
                                </Typography>
                            </Box>
                        </FlexCenter>
                        {activities.length === 0 ? (
                            <>
                                <PageIcon
                                    srcIcon={empty_activity}
                                    altIcon={t("accessibility.asset.empty-activity-alt")}
                                />
                                <FlexCenter>
                                    <Typography className={cx(classes.label, classes.grey)}>
                                        {t("page.activity-planner.no-activity")}
                                    </Typography>
                                </FlexCenter>
                            </>
                        ) : (
                            <>
                                {activities.map((activity, iteration) => (
                                    <FlexCenter key={"activity-" + iteration}>
                                        <ActivityCard
                                            labelledBy={""}
                                            describedBy={""}
                                            label={activity.label}
                                            onClick={() => navToActivity(iteration)}
                                        />
                                    </FlexCenter>
                                ))}
                            </>
                        )}
                    </SurveyPage>
                    <AddActivityOrRoute
                        labelledBy={""}
                        describedBy={""}
                        onClickActivity={onAddActivity}
                        onClickRoute={onAddRoute}
                        handleClose={onCloseAddActivityOrRoute}
                        open={isAddActivityOrRouteOpen}
                    />
                </>
            )}
            <Outlet
                context={{
                    source: context.source,
                    data: context.data,
                    idSurvey: context.idSurvey,
                    surveyRootPage: context.surveyRootPage,
                }}
            />
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { ActivityOrRoutePlannerPage } })(theme => ({
    infoBox: {
        width: "350px",
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
}));

export default ActivityOrRoutePlannerPage;
