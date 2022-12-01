import { Box, Typography } from "@mui/material";
import empty_activity from "assets/illustration/empty-activity.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PageIcon from "components/commons/PageIcon/PageIcon";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import ActivityCard from "components/edt/ActivityCard/ActivityCard";
import AddActivityOrRoute from "components/edt/AddActivityOrRoute/AddActivityOrRoute";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { makeStylesEdt } from "lunatic-edt";
import { callbackHolder } from "orchestrator/Orchestrator";
import React from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { getCurrentNavigatePath } from "service/navigation-service";
import { getActivities, setLoopSize } from "service/survey-activity-service";
import {
    getLoopSize,
    getPrintedFirstName,
    getSurveyDate,
    LoopPage,
    saveData,
} from "service/survey-service";

const ActivityPlannerPage = () => {
    const navigate = useNavigate();
    const context = useOutletContext() as OrchestratorContext;
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const [isSubchildDisplayed, setIsSubChildDisplayed] = React.useState(false);
    const [isAddActivityOrRouteOpen, setIsAddActivityOrRouteOpen] = React.useState(false);
    const [contextIteration, setContextIteration] = React.useState(0);

    const activities = getActivities(context.idSurvey);

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
            getLoopSize(context.idSurvey, LoopPage.ACTIVITY) + 1,
        );
        setContextIteration(loopSize - 1);
        navToActivity(contextIteration);
    };

    const onAddRoute = () => {
        //TODO : check the good path for routes when it will be done
        const loopSize = setLoopSize(
            context.source,
            getLoopSize(context.idSurvey, LoopPage.ACTIVITY) + 1,
        );
        setContextIteration(loopSize - 1);
        navToActivity(contextIteration);
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
                LoopPage.ACTIVITY,
                iteration,
            ),
        );
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
                                    {getSurveyDate(context.idSurvey) + " TODO : print plain text"}
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
                            <FlexCenter>
                                {activities.map((activity, iteration) => (
                                    <ActivityCard
                                        labelledBy={""}
                                        describedBy={""}
                                        key={"activity-" + iteration}
                                        label={activity.label}
                                        onClick={() => navToActivity(iteration)}
                                    />
                                ))}
                            </FlexCenter>
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
                    iteration: contextIteration,
                }}
            />
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { ActivityPlannerPage } })(theme => ({
    infoBox: {
        width: "350px",
    },
    label: {
        fontSize: "14px",
    },
    date: {
        fontSize: "18px",
    },
    grey: {
        color: theme.palette.action.hover,
    },
}));

export default ActivityPlannerPage;
