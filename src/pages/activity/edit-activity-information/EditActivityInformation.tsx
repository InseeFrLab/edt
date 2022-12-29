import { Box, Typography } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import ActivityOrRouteCard from "components/edt/ActivityCard/ActivityOrRouteCard";
import StepNavCard from "components/edt/StepNavCard/StepNavCard";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { makeStylesEdt } from "lunatic-edt";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { loopActivityRouteStepperData, loopActivityStepperData } from "service/loop-stepper-service";
import { navFullPath } from "service/navigation-service";

const EditActivityInformationPage = () => {
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    const { classes } = useStyles();
    const stepsData = context.activityOrRoute?.isRoute
        ? loopActivityRouteStepperData
        : loopActivityStepperData;

    const navToStep = useCallback(() => {
        console.log("navToStep");
    }, []);

    return (
        <SurveyPage
            onNavigateBack={() => navFullPath(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER)}
            simpleHeaderLabel={t("page.edit-activity-information.header")}
            simpleHeader={true}
            backgroundWhiteHeader={false}
        >
            <FlexCenter>
                <ActivityOrRouteCard
                    labelledBy={""}
                    describedBy={""}
                    activityOrRoute={context.activityOrRoute || {}}
                />
            </FlexCenter>
            <Box className={classes.titleBox}>
                <Typography className={classes.title}>
                    {t("page.edit-activity-information.what-to-edit")}
                </Typography>
            </Box>
            <Box className={classes.flexColumn}>
                {stepsData.map(stepData => (
                    <StepNavCard
                        key={"nav-to-step-" + stepData.stepNumber}
                        onClick={() => navToStep()}
                        labelledBy={""}
                        describedBy={""}
                        stepData={stepData}
                    />
                ))}
            </Box>
        </SurveyPage>
    );
};

const useStyles = makeStylesEdt({ "name": { StepNavCard } })(theme => ({
    flexColumn: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    titleBox: {
        marginLeft: "5%",
        marginTop: "2rem",
        marginBottom: "2rem",
    },
    title: {
        fontSize: "18px",
        fontWeight: "bold",
        color: theme.palette.text.primary,
    },
}));

export default EditActivityInformationPage;
